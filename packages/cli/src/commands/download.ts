import { Command } from '@oclif/core';
import { download } from '../functions/download';

export default class Download extends Command {
  public async run(): Promise<void> {
    await download();
  }
}
