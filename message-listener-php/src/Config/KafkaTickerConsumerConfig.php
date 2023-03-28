<?php

namespace App\Config;

use App\Dto\TickerMessage;
use App\Mapper\ConfigMessageMapper;
use App\Mapper\TickerMessageMapper;

class KafkaTickerConsumerConfig {

  private mixed $config = null;

  public function __construct(
    private string $kafkaBrokers,
    private string $tickerTopic,
    private string $configTopic
  ) {
    
  }

  /**
   * Get the value of kafkaBrokers
   */ 
  public function getKafkaBrokers()
  {
      return $this->kafkaBrokers;
  }

  /**
   * Get the topic configuration config
   */ 
  public function getConfig()
  {
    if (!$this->config) {
      
      // TODO: Create na object which represents each topic configuration
      $this->config = [
        'ticker' => [
          'topic' => $this->tickerTopic,
          'mapper' => new TickerMessageMapper(),
          'filter' => function (TickerMessage $a, array $payload) {
            foreach($payload as $exchange) {
              if ($exchange["exchange"] == $a->getExchange() && in_array($a->getPair(), $exchange["pairs"])) {
                return true;
              }
            }
            return false;
          }
        ],
        'configuration' => [
          'topic' => $this->configTopic,
          'mapper' => new ConfigMessageMapper(),
          'filter' => function (mixed $a, mixed $payload) { return true; }
        ]
      ];
    }
    
    return $this->config;
  }
}