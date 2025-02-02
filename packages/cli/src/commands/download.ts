import { download } from '@instagram/sdk';
import { Command } from '@oclif/core';

export default class Download extends Command {
  public async run(): Promise<void> {
    await download();
  }
}
