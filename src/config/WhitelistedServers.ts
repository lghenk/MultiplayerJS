interface WhitelistItem {
  ip: string;
  key: string;
}

const Whitelist = {
  Matchmaking: <WhitelistItem[]> [],
  MultiplayerNode: <WhitelistItem[]> []
}

module.exports = Whitelist
