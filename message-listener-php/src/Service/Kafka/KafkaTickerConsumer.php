<?php

namespace App\Service\Kafka;

use App\Dto\TickerMessage;
use Exception;
use Psr\Log\LoggerInterface;
use \RdKafka\Conf;
use RdKafka\KafkaConsumer;
use Rx\Observable;
use Rx\Subject\Subject;

class KafkaTickerConsumer
{
  private ?Subject $tickerSubject = null;

  public function __construct(private LoggerInterface $logger)
  {
  }

  private function init()
  {
    $this->tickerSubject = new Subject();

    $conf = new Conf();
    $conf->set('group.id', 'myConsumerGroup');
    $conf->set('metadata.broker.list', '127.0.0.1');
    $conf->set('auto.offset.reset', 'earliest');
    $conf->set('enable.partition.eof', 'true');
    $consumer = new KafkaConsumer($conf);
    $consumer->subscribe(['exchange_pair_prices_table_last']);


    Observable::interval(100)->subscribe(function () use ($consumer) {
      $this->logger->debug("Reading from Kafka");
      $message = $consumer->consume(1000);
      switch ($message->err) {
        case RD_KAFKA_RESP_ERR_NO_ERROR:
          $this->logger->debug("Read from kafka: err: ".RD_KAFKA_RESP_ERR_NO_ERROR);
          $this->logger->debug($message->payload);
          try {
            $decoded = json_decode($message->payload, true);
            $tickerMessage = new TickerMessage(
              $decoded['exchange'],
              $decoded['pair'],
              $decoded['type'],
              $decoded['time'],
              $decoded['price'],
              $decoded['size'],
            );
            $this->tickerSubject->onNext($tickerMessage);
            
          } catch (Exception $e) {
            $this->logger->error($e->getMessage());
          }
          break;
        case RD_KAFKA_RESP_ERR__PARTITION_EOF:
          $this->logger->debug("No more messages in the topic");
          break;
        case RD_KAFKA_RESP_ERR__TIMED_OUT:
          $this->logger->debug("Timed out: still no new messages");
          break;
        default:
          throw new \Exception($message->errstr(), $message->err);
          break;
      }
      $this->logger->debug("End Reading from Kafka");
    });

    
  }

  public function getTicker(Array $pairs): Observable
  {
    if (!$this->tickerSubject) {
      $this->init();
    }
    return $this->tickerSubject->filter(function (TickerMessage $a) use ($pairs) { return in_array($a->getPair(), $pairs); });
  }
}
