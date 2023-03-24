<?php

namespace App\Service\Websocket;

use App\Entity\Client;
use Psr\Log\LoggerInterface;
use Ratchet\ConnectionInterface;

class ClientsManager {

  public function __construct(private LoggerInterface $logger, private $clients = [])
  {
    
  }


  public function &getClientByConn(ConnectionInterface $conn): ?Client {
    foreach($this->clients as &$client) {
      if ($client->getConn() == $conn) {
        $this->logger->debug("Client found");
        return $client;
      }
    }
    return null;
  }
  

  public function addClient(Client &$client): int {
    $this->logger->debug("Add Client");
    return array_push($this->clients, $client);
  }

  public function removeClient(Client &$client): int {
    $this->logger->debug("Remove Client");

    array_splice($this->clients, array_search($client, $this->clients, true));
    return count($this->clients);
  }
}