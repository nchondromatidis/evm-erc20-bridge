### Installation
>npm install

### Run System
The system is not complete. You can only run some tests.
> npm run test --workspace=bridge-service

### Docs
You may also take a look at the docs where I created a sequence diagram before
I started coding the solution.

### Architecture
The architectural style used is ports and adapters architecture.

<img src="https://sd.blackball.lv/data/items/202405/19658/03-hexagonal-architecture.v2-600x431.png" width="300"/>

This way we can have all of our chain independent algorithms in 
the center and use chain/app specific adapters to get/execute specific tasks.

I wanted to showcase a system that would leverage short, non-blocking tasks
(but I had not time to do so).

I use tests to drive my development.

In the same style I designed and implemented a bridge in the past.

You can start in app/use-cases, each use case accomplishes a business task.
For each use-case there some tests.


### Development Progress
The scope of this task was big. Since I would be evaluated on the quality and
understanding I stopped half way. 

Use-cases list:
- InitSystemUseCase: registers event handlers ✔️
- ReceiveNewTransferObjectUseCase: validated and adds transfer object to system ✔️
- TargetChainTransfer: relays saved transfer object to solver ❌
- ExecuteRefund: executes refund ❌

### Notes:
Things I did not do to save time
- immutability
- save to file instead of db (class-transformer)
- no crash safety/restore
- config in json
- tests filesystem parallel




