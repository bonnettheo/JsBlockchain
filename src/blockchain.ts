var CryptoJS = require("crypto-js");
import {Block} from "./block";
import {broadcast, response_latest_msg} from "./server"


export var calculate_hash = (index, previous_hash, timestamp, data) => {
	return CryptoJS.SHA256(index + previous_hash + timestamp + data).toString();
};

var genesis_block = () => {
	return new Block(0, "0", 0, "first block", "0082f4e05d9e92b1e25099db67bf54cc584fb61a5d3f8560026ef9d7fec1f91b")
}

export var blockchain = [genesis_block()];

export var get_latest_block = () => {
	return blockchain[blockchain.length -1];
}

export var generate_block = (data) => {
	var previous_block = get_latest_block();
	var next_index = previous_block.index + 1;
	var previous_hash = previous_block.hash;
	var next_timestamp = new Date().getTime() /1000;
	var next_hash = calculate_hash(next_index, previous_hash, next_timestamp, data);
	return new Block(next_index, previous_hash, next_timestamp, data, next_hash);
}

var is_valid_chain = (new_blocks) => {
	if(JSON.stringify(new_blocks[0]) !== JSON.stringify(genesis_block())){
		console.log(new_blocks[0]);
		console.log(genesis_block());
		return false;
	}

	for (var i = 1; i < new_blocks.length; i++) {
		if (!new_blocks[i].is_valid(new_blocks[i-1])) {
			return false;
		}
	}
	return true;
}

var replace_chain = (new_blocks) => {
	if (is_valid_chain(new_blocks) && new_blocks.length > blockchain.length) {
		console.log('new block chain accepted');
		blockchain = new_blocks;
		broadcast(response_latest_msg());
	} else {
		console.log('new blockchain refused');
	}
};

export var add_block = (new_block) => {
	if (new_block.is_valid(get_latest_block())) {
		blockchain.push(new_block);
	}
}; 
