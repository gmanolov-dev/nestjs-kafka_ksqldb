<?php

namespace App\Mapper;

use App\Dto\TickerMessage;

class TickerMessageMapper implements MessageMapperInterface {

  public function map(string $key, mixed $input): TickerMessage {
    return new TickerMessage(
      $input['exchange'],
      $input['pair'],
      $input['type'],
      $input['time'],
      $input['price'],
      $input['size'],
    );
  }
}