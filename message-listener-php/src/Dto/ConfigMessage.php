<?php

namespace App\Dto;

use JsonSerializable;

class ConfigMessage implements JsonSerializable
{
  public function __construct(
    private string $exchange,
    private array $pairs,
  ) {
  }

  public function jsonSerialize(): mixed
  {
      $vars = get_object_vars($this);

      return $vars;
  }


    /**
     * Get the value of pairs
     */ 
    public function getPairs()
    {
        return $this->pairs;
    }
}
