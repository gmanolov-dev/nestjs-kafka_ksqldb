<?php

namespace App\Dto;

use JsonSerializable;

class TickerMessage implements JsonSerializable
{

  public function __construct(
    private string $exchange,
    private string $pair,
    private string $type,
    private string $time,
    private float $price,
    private float $size
  ) {
  }

  public function jsonSerialize(): mixed
  {
      $vars = get_object_vars($this);

      return $vars;
  }

  /**
   * Get the value of exchange
   */
  public function getExchange()
  {
    return $this->exchange;
  }

  /**
   * Get the value of pair
   */
  public function getPair()
  {
    return $this->pair;
  }

  /**
   * Get the valusizee of type
   */
  public function getType()
  {
    return $this->type;
  }

  /**
   * Get the value of time
   */
  public function getTime()
  {
    return $this->time;
  }

  /**
   * Get the value of price
   */
  public function getPrice()
  {
    return $this->price;
  }

  /**
   * Get the value of size
   */
  public function getSize()
  {
    return $this->size;
  }
}
