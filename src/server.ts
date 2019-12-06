var express = require("express");
var body_parser = require("body-parser");
var WebSocket = require("ws");


var http_port = process.env.HTTP_PORT || 3001;

import * as bc from "./blockchain";



var sockets = [];

var message_type = {
	QUERY_LATEST: 0,
	QUERY_ALL: 1,
	RESPONSE_BLOCKCHAIN: 2
};

var write = (ws, message) => ws.send(JSON.stringify(message));

export var broadcast = (message) => sockets.forEach(socket => write(socket, message));

export var response_latest_msg = () => ({
	'type': message_type.RESPONSE_BLOCKCHAIN,
	'data': JSON.stringify([bc.get_latest_block()])
});

var init_http_server = () => {
	var app = express();
	app.use(body_parser.json());

	app.get('/blocks', (req, res) => res.send(JSON.stringify(bc.blockchain)));

	app.post('/mineBlock', (req, res) => {
		if(req.body.data == undefined){
			throw new Error("data empty");
		}
		var new_block = bc.generate_block(req.body.data);
		bc.add_block(new_block);
		broadcast(response_latest_msg());
		console.log('block added : ' + JSON.stringify(new_block));
		res.send();
	});

	app.get('/peers', (req, res) => {
		res.send(sockets.map(s => s._socket.remote_address + ':' + s._socket.remote_port));
	});

	app.post('/add_peer', (req, res) => {
		connect_to_peers([req.body.peer]);
		res.send();
	});

	app.listen(http_port, () => console.log('Listening on port ' + http_port));
}

var init_connection = (ws) => {};

var connect_to_peers = (new_peers) => {
	new_peers.forEach((peer) => {
		var ws = new WebSocket(peer);
		ws.on('open', () => init_connection(ws));
		ws.on('error', () => {
			console.log('connection failed')
		});
	});
};



init_http_server();
