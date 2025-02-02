import { download } from '@instagram/common';
import { Command } from '@oclif/core';

export default class Download extends Command {
  public async run(): Promise<void> {
    await download();
  }
}
