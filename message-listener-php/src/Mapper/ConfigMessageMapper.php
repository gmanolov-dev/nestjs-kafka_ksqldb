<?php

namespace App\Mapper;

use App\Dto\Confi;
use App\Dto\ConfigMessage;

class ConfigMessageMapper implements MessageMapperInterface {
  // {"BTC-USD":false,"BTC-EUR":false,"ETH-USD":true,"ETH-EUR":false}
  public function map(string $key, mixed $payload): ConfigMessage {
    
    return new ConfigMessage($key, $payload);
  }
}