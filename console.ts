import { ConnectFourPlayingServiceFactory } from './classes';

class Main {
    public run():void {
        let modelFactory = new ConnectFourPlayingServiceFactory();
        // let view = new ConnectFourTextStreamView();
        // let controller = new ConnectFourTextStreamController(modelFactory, view);
        // controller.main();
    }
}

export { Main };
