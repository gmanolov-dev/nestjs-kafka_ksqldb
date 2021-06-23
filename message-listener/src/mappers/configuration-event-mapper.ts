import { Injectable } from '@nestjs/common';
import { Message } from 'kafkajs';
import { ConfigurationEvent } from 'src/domain/entities/configuration-event';


@Injectable()
export class ConfigurationEventMapper {
  fromConfiguratonEventMessage(message: Message): ConfigurationEvent {
    return new ConfigurationEvent(
      message.key.toString(), JSON.parse(message.value.toString())
    )
  };
}
