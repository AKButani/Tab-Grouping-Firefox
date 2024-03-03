//this is the execution queue, ensuring that everything is executed sequentially when 
//multiple tabs are manipulated at the same time
let queue = Promise.resolve();

export async function addToQueue(task: () => Promise<void>) {
    // Chain the task to the queue to ensure it's executed sequentially
    queue = queue.then(task).catch(err => console.error(err));
}