<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use App\Service\Websocket\MessageService;
use Ratchet\Server\IoServer;
use React\EventLoop\Loop;
use Rx\Observable;
use Rx\Scheduler;

#[AsCommand(name: 'app:start-websocket')]
class StartWebsocketCommand extends Command {

  protected static $defaultDesctiption = "Starts ratchet websocket";
  protected MessageService $ms;

  public function __construct(MessageService $ms) {
    parent::__construct();
    $this -> ms = $ms;
  }

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $server = IoServer::factory($this -> ms, 8001);
    $loop = $server->loop;

    Scheduler::setDefaultFactory(function() use($loop){
        return new Scheduler\EventLoopScheduler($loop);
    });
    $server -> run();
    return Command::SUCCESS;
  }

  protected function configure(): void {
    $this->setHelp("Starts ratchet wesocket server");
  }
}
