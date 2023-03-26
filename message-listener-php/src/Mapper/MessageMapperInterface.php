<?php

namespace App\Mapper;

interface MessageMapperInterface {
  public function map(string $key, mixed $payload): mixed;
}