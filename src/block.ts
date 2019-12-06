class Block {
	
	index: number;
	previous_hash: string;
	timestamp: number;
	data: string;
	hash: string;
	
	constructor(index, previous_hash, timestamp, data, hash){
		this.index = index;
		this.previous_hash = previous_hash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}
}
