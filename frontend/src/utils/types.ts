export interface Channel {
	name: string;
	visibility: string;
}

export interface PrivateMessage {
	id: number;
	receiver: User;
	sender: User;
	content: string;
	timestamp: string;
}

export interface Friendship {
	id: number;
	initiatorId: number;
	receiverId: number;
	receiver: User;
	initiator: User;
	status: 'ACCEPTED' | 'PENDING' | 'BLOCKED';
}

export interface User {
	id: number;
	username: string;
	avatar: string;
	useTwoFa: boolean;
	status: 'ONLINE' | 'OFFLINE' | 'IN_GAME';
};

export interface ChannelMessage {
	id: number;
	content: string;
	sender: User;
	channelId: string;
	timestamp: string;
}


export interface ChannelUser {
	user: User;
	roomId: string;
	role?: 'MEMBER' | 'BANNED' | 'MUTED' | 'ADMIN' | 'OWNER';
	muted: boolean;
}
