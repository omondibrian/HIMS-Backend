/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Eucossa
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IMail, IMailer } from "../src/services/email";

export class NotificationService implements IMailer {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
    public send = async (mail: IMail): Promise<{ messageId: string; msg: string }> => {
      return { messageId: "1", msg: "test msg" };
    }
  }
