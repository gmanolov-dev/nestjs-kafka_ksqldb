<?php
namespace App\ValueObject;

use Rx\DisposableInterface;

class Subscription {
  public function __construct(private string $topic, private mixed $payload, private DisposableInterface $disposable)
  {
    
  }

  /**
   * Get the value of topic
   */ 
  public function getTopic()
  {
    return $this->topic;
  }

  /**
   * Get the value of payload
   */ 
  public function getPayload()
  {
    return $this->payload;
  }

  /**
   * Get the value of disposable
   */ 
  public function getDisposable()
  {
    return $this->disposable;
  }

  public function __destruct()
  {
    $this->disposable->dispose();
  }
}