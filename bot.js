// discord.js モジュールのインポート
const Discord = require('discord.js');

// Discord Clientのインスタンス作成
const client = new Discord.Client();

// トークンの用意
const token = process.argv[2];

// 準備完了イベントのconsole.logで通知黒い画面に出る。
client.on('ready',() => { console.log('ready...'); });

var keeper;
// メッセージがあったら何かをする
client.on('message', message => {
  let channel = message.channel;
  let messages = message.content;

  if (channel.type == 'dm') {
    if(message.author == keeper){
      if(/^@/.test(messages)){
        reply = message.mentions.users.array()[0];
        reply.send(messages)
            .then(msg => console.log(`Sent a reply to ${reply}`))
            .catch(console.error);
        return;
      }
    }else if(!message.author.bot){
        keeper.send(message.author+'send message :\n================\n'+messages)
            .then(msg => console.log(`Sent a messages to ${keeper.author}`))
            .catch(console.error);
        return;
    }
  } else if (channel.type == 'text') {
    // 挨拶を返す
    if (/^[Hello|hello]/.test(messages)) {

      let author = message.author.username;
      let reply_text = 'こんばんわ。' + author + '様。';

      // そのチェンネルにメッセージを送信する
      channel.send(reply_text)
          .then(message => console.log('Sent message: ' + reply_text))
          .catch(console.error);

      return;
    }
    // ログアウト
    if (messages == ':exit') {

      // そのチェンネルにメッセージを送信する
      channel.send('bye')
          .then(message => console.log('Sent message: bye'))
          .catch(console.error);

      client.destroy();
      return;
    }
    //keeperを設定する
    if (/^[:keeper|:Keeper]/.test(messages)) {
      keeper = message.mentions.users.array()[0];
      if(keeper  == null){
        keeper = message.author;
      }
      let reply_text = keeper + '様をkeeperとして設定しました。';

      channel.send(reply_text)
          .then(message => console.log('Sent message: ' + reply_text))
          .catch(console.error);

      keeper.send('あなたはkeeperになりました')
          .then(msg => console.log(`Sent a reply to ${keeper.author}`))
          .catch(console.error);
      return;
    }
  }

});

client.on('messageReactionAdd', function(messageReactin, user) {
  let channel = messageReactin.message.channel;

  channel.send(user.username + '様、ありがとうございます。')
      .then(message => console.log('Sent message: reply action'))
      .catch(console.error);

  return;
});

// Discordへの接続
client.login(token);
