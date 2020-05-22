export enum Command {
	IAC						= 255,
	DONT					= 254,
	DO						= 253,
	WONT					= 252,
	WILL					= 251,
	SB						= 250,
	GA						= 249,
	EL						= 248,
	EC						= 247,
	SE						= 240,
	EOR						= 239,
	ABORT					= 238,
	SUSP					= 237,
	xEOF					= 236
};

export enum Color {
	BLINK					= "\u001b[5m",
	CLEAR					= "\u001b[0m",
	MAROON					= "\u001b[0;31m",
	DARK_GREEN				= "\u001b[0;32m",
	OLIVE					= "\u001b[0;33m",
	NAVY					= "\u001b[0;34m",
	PURPLE					= "\u001b[0;35m",
	TEAL					= "\u001b[0;36m",
	SILVER					= "\u001b[0;37m",
	GREY					= "\u001b[1;30m",
	CRIMSON					= "\u001b[1;31m",
	LIME					= "\u001b[1;32m",
	YELLOW					= "\u001b[1;33m",
	BLUE					= "\u001b[1;34m",
	PINK					= "\u001b[1;35m",
	CYAN					= "\u001b[1;36m",
	WHITE					= "\u001b[1;37m"
};

export enum Environment {
	IS						= 0,
	SEND					= 1
};

export enum Protocol {
	TRANSMIT_BINARY			= 0,
	ECHO					= 1,
	RECONNECTION			= 2,
	SUPPRESSGA				= 3,
	MESSAGE_SIZE_NEG		= 4,
	STATUS					= 5,
	TIMING_MARK				= 6,
	REMOTE_TRANS_ECHO		= 7,
	OUTPUT_LINE_WIDTH		= 8,
	OUTPUT_PAGE_SIZE		= 9,
	OUTPUT_CARRIAGE_RETURN	= 10,
	OUTPUT_H_TABSTOP		= 11,
	OUTPUT_H_TAB			= 12,
	OUTPUT_FORMFEED			= 13,
	OUTPUT_V_TABSTOP		= 14,
	OUTPUT_V_TAB			= 15,
	OUTPUT_LINEFEED			= 16,
	EXTENDED_ASCII			= 17,
	LOGOUT					= 18,
	BYTE_MACRO				= 19,
	DATA_ENTRY_TERMINAL		= 20,
	SUPDUP					= 21,
	SUPDUP_OUT				= 22,
	SEND_LOCATION			= 23,
	TTYPE					= 24,
	EOR						= 25,
	TACACS					= 26,
	OUTPUT_MARKINGS			= 27,
	TERMINAL_LOCATION_NUM	= 28,
	TELNET_3270_REGIME		= 29,
	X3_PAD					= 30,
	NAWS					= 31,
	TERMINAL_SPEED			= 32,
	REMOTE_FLOW_CONTROL		= 33,
	LINEMODE				= 34,
	X_DISPLAY_LOCATION		= 35,
	TELNET_AUTH_OPT			= 37,
	ENCRYPT					= 38,
	TELNET_ENV_OPT			= 39,
	MSDP					= 69,
	MSSP					= 70,
	MCCP					= 85,
	MCCP2					= 86
};