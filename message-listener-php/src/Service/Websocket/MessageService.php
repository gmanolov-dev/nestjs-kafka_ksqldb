<?php

namespace App\Service\Websocket;

use App\Dto\TickerMessage;
use App\Entity\Client;
use App\Service\Kafka\KafkaTickerConsumer;
use App\ValueObject\Subscription;
use Exception;
use Psr\Log\LoggerInterface;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Rx\Observable;

class MessageService implements MessageComponentInterface
{

  public function __construct(
    private LoggerInterface $logger,
    private KafkaTickerConsumer $consumer,
    private ClientsManager $clientsManager
  )
  {
  }

  public function onOpen(ConnectionInterface $conn)
  {
    $client = new Client($conn);
    $this->clientsManager->addClient($client);
  }

  function onMessage(ConnectionInterface $from, $msg)
  {
    $msgDecoded = [];
    try {
      $msgDecoded = json_decode($msg, true);
    } catch (Exception $e) {
      $this->logger->error("error: " . $e->getMessage());
      return;
    }
    $client = $this->clientsManager->getClientByConn($from);
    if (!$client) {
      $from->send(json_encode(["err" => "Something went wrong. Closing socket !!!"]));
      $from->close();
      return;
    }
    // {"action": "subscribe", "topic": "ticker", "pairs": ["BTC-USD"]}
    if (($msgDecoded['action'] ?? null) == 'subscribe' && ($msgDecoded['topic'] ?? null) == 'ticker' && is_array($msgDecoded["pairs"] ?? null)) {
      $this->subscribeToTicker($client, $msgDecoded['pairs']);
    } else if ($msgDecoded['action'] ?? null == 'unsubscribe' && $msgDecoded['topic'] ?? null == 'ticker') {
      $this->unsubscribeToTicker($client);
    } 
  }

  public function onClose(ConnectionInterface $conn)
  {
    if ($client = $this->clientsManager->getClientByConn($conn)) {
      $this->clientsManager->removeClient($client);
    }
  }

  public function onError(ConnectionInterface $conn, Exception $e)
  {
    if ($client = $this->clientsManager->getClientByConn($conn)) {
      try {
        $conn->close();
      } catch (Exception $e) {
      }
      $this->clientsManager->removeClient($client);
    }
  }

  private function subscribeToTicker(Client &$client, array $pairs): void {
    $disposable = $this->consumer
        ->getTicker($pairs)
        ->subscribe(function (TickerMessage $msg) use ($client) {
          $this->logger->debug("Sending data to client");
          $client->getConn()->send(json_encode($msg, JSON_PRETTY_PRINT)."\n");
      });
      $subscription = new Subscription("ticker", $pairs, $disposable);
      $client->addSubscription($subscription);
  }

  private function unsubscribeToTicker(Client &$client): void {
    $client->unsubscribe("ticker");
  }
}
