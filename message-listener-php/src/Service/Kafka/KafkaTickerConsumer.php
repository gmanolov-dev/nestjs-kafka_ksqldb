<?php

namespace App\Service\Kafka;

use App\Config\KafkaTickerConsumerConfig;
use App\Dto\TickerMessage;
use App\Mapper\TickerMessageMapper;
use App\Mapper\ConfigMessageMapper;
use Exception;
use Psr\Log\LoggerInterface;
use \RdKafka\Conf;
use RdKafka\KafkaConsumer;
use Rx\Observable;
use Rx\Subject\ReplaySubject;

class KafkaTickerConsumer
{
  private $subjects = [];
  private $configByTopic = [];

  public function __construct(private KafkaTickerConsumerConfig $kafkaTickerConsumerConfig, private LoggerInterface $logger)
  {
    
  }

  private function init()
  {
    $topics = array_values(array_map(function ($el) { return $el["topic"]; }, $this->kafkaTickerConsumerConfig->getConfig()));
    foreach($this->kafkaTickerConsumerConfig->getConfig() as $key => $cf) {
      $this->subjects[$key] = new ReplaySubject(20);
      $this->configByTopic[$cf["topic"]] = $key;
    }


    $conf = new Conf();
    $conf->setRebalanceCb(function (KafkaConsumer $kafka, $err, array $partitions = null) {
      switch ($err) {
        case RD_KAFKA_RESP_ERR__ASSIGN_PARTITIONS:
          $this->logger->notice(sprintf("Asign partiions: %s", print_r($partitions, true)));
          $kafka->assign($partitions);
          break;
        case RD_KAFKA_RESP_ERR__REVOKE_PARTITIONS:
          $this->logger->notice(sprintf("Revoke partiions: %s", print_r($partitions, true)));
          $kafka->assign(NULL);
          break;

        default:
          throw new \Exception($err);
      }
    });
    $conf->set('group.id', 'myConsumerGroup'.rand(1, 100000));
    $conf->set('metadata.broker.list', 'broker-prod:29092');
    $conf->set('auto.offset.reset', 'earliest');
    $conf->set('enable.partition.eof', 'true');
    $consumer = new KafkaConsumer($conf);
    $consumer->subscribe($topics);
    $this->logger->error(print_r($topics, true));


    Observable::interval(1000)->subscribe(function () use ($consumer) {
      $this->logger->debug("Reading from Kafka");
      $this->readMeassages($consumer, 1000);
      $this->logger->debug("End Reading from Kafka");
    });
  }

  public function getObservable(string $name, mixed $payload): Observable
  {
    if (!count($this->subjects)) {
      $this->init();
    }
    return $this->subjects[$name]->filter(function ($el) use($name, $payload) { return $this->kafkaTickerConsumerConfig->getConfig()[$name]["filter"]($el, $payload);} );
  }

  private function readMeassages(KafkaConsumer $consumer, int $messageCount): void 
  {
    $counter = 0;
    while ($messageCount > 0) {
      $messageCount--;
      $counter ++;
      $message = $consumer->consume(1000);
      switch ($message->err) {
        case RD_KAFKA_RESP_ERR_NO_ERROR:
          $this->logger->debug("Read from kafka: err: " . RD_KAFKA_RESP_ERR_NO_ERROR);
          $this->logger->debug($message->payload);
          $this->logger->debug($message->key ?? "");
          try {
            $decoded = json_decode($message->payload, true);
            $tickerMessage = $this->kafkaTickerConsumerConfig->getConfig()[$this->configByTopic[$message->topic_name]]["mapper"]->map($message->key ?? "", $decoded);
            $this->subjects[$this->configByTopic[$message->topic_name]]->onNext($tickerMessage);
          } catch (Exception $e) {
            $this->logger->error($e->getMessage());
          }
          break;
        case RD_KAFKA_RESP_ERR__PARTITION_EOF:
          $this->logger->debug("No more messages in the topic");
          break 2;
        case RD_KAFKA_RESP_ERR__TIMED_OUT:
          $this->logger->debug("Timed out");
          break 2;
        default:
          throw new \Exception($message->errstr(), $message->err);
          break;
      }
    }
    $this->logger->debug(sprintf("Read %d messages from kafka", $counter));
  }
}
