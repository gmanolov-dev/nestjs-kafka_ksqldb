<?php

namespace App\Entity;

use App\ValueObject\Subscription;
use Ratchet\ConnectionInterface;

class Client {

  private array $subscriptions;

  public function __construct(private ConnectionInterface $conn)
  {
    $this->subscriptions = [];
  }


  /**
   * Get the value of subscriptions
   */ 
  public function getSubscriptions(): array
  {
    return $this->subscriptions;
  }

  public function getSubscriptionByTopic(string $topic): ?Subscription {
    foreach($this->subscriptions as &$subscription) {
      if ($subscription->getTopic() == $topic) {
        return $subscription;
      }
    }
    return null;
  }

  public function unsubscribe(string $topic): void {
    if ($sub = $this->getSubscriptionByTopic($topic)) {
      array_splice($this->subscriptions, array_search($sub, $this->subscriptions, true));
    }
  }

  public function addSubscription(Subscription $subscription): void {
    $this->unsubscribe($subscription->getTopic());
    array_push($this->subscriptions, $subscription);
  }

  /**
   * Get the value of conn
   */ 
  public function getConn()
  {
    return $this->conn;
  }

}