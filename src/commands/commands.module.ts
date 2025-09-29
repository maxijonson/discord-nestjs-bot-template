import { Module, type Provider } from "@nestjs/common";
import { PingCommand } from "./handlers/ping.command";
import { EchoCommand } from "./handlers/echo.command";
import { WhatisCommand } from "./handlers/whatis.command";
import { PurgeCommand } from "./handlers/purge.command";
import { UploadCommand } from "./handlers/upload.command";
import { ConfigCommand } from "./handlers/config/config.command";
import { ConfigSetCommand } from "./handlers/config/config-set.command";
import { ConfigDeleteCommand } from "./handlers/config/config-delete.command";
import { ConfigClearCommand } from "./handlers/config/config-clear.command";
import { SearchCommand } from "./handlers/search.command";
import { SelectMemberCommand } from "./handlers/select/select-member.command";
import { SelectStringCommand } from "./handlers/select/select-string.command";
import { SelectRoleCommand } from "./handlers/select/select-role.command";
import { SelectChannelCommand } from "./handlers/select/select-channel.command";
import { SelectMentionableCommand } from "./handlers/select/select-mentionable.command";
import { SelectDynamicCommand } from "./handlers/select/select-dynamic.command";

// You can easily disable commands by removing them from this array.
// This way, you can keep the code as reference but not have it active.
// Alternatively, you could just delete the files and refer to the GitHub history if needed.
const HANDLERS: Provider[] = [
  PingCommand,
  EchoCommand,
  WhatisCommand,
  PurgeCommand,
  UploadCommand,
  ConfigCommand,
  ConfigSetCommand,
  ConfigDeleteCommand,
  ConfigClearCommand,
  SearchCommand,
  SelectStringCommand,
  SelectMemberCommand,
  SelectRoleCommand,
  SelectChannelCommand,
  SelectMentionableCommand,
  SelectDynamicCommand,
];

@Module({
  providers: [...HANDLERS],
})
export class CommandsModule {}
