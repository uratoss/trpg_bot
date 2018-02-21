// discord.js モジュールのインポート
const Discord = require('discord.js');
// requestモジュールのインポート
const request = require('request');

// Discord Clientのインスタンス作成
const client = new Discord.Client();

// トークンの用意
const token = process.argv[2];
const api_key = process.argv[3];

var context = '';
var mode = 'dialog';

// 準備完了イベントのconsole.logで通知黒い画面に出る。
client.on('ready', () => { console.log('ready...'); });

// keeperを入れておく
var keeper;
// メッセージがあったら何かをする
client.on('message', message => {
  let channel = message.channel;
  let messages = message.content;

  if (channel.type == 'dm') {
    // trpgモード
    if (keeper != null) {
      if (message.author == keeper) {
        if (/ ^@ /.test(messages)) {
          let reply_user = message.mentions.users.array()[0];
          if (reply_user == null) {
            keeper.send("自分以外に宛ててください")
                .then(msg => console.log(`Sent a reply to ${ reply_user }`))
                .catch(console.error);
            return;
          }
          reply_user.send(messages)
              .then(msg => console.log(`Sent a reply to ${ reply_user }`))
              .catch(console.error);
          return;
        }
      } else if (!message.author.bot) {
        keeper
            .send(message.author + 'send message : \n==================\n' +
                    messages)
            .then(mdg => console.log(`Sent a messages to ${ keeper.author }`))
            .catch(console.error);
        return;
      }
    }
  } else if (channel.type == 'text') {
    // 挨拶を返す
    if (/ ^[Hello | hello] /.test(messages)) {

      let author = message.author.username;
      let reply_text = 'こんばんわ。' + author + '様。';

      // そのチェンネルにメッセージを送信する
      channel.send(reply_text)
          .then(message => console.log('Sent message: ' + reply_text))
          .catch(console.error);

      return;
    } else if (messages == ':exit') {
      // ログアウト
      // そのチェンネルにメッセージを送信する
      channel.send('bye')
          .then(message => console.log('Sent message: bye'))
          .catch(console.error);

      client.destroy();
      return;
    } else if (/ ^[:keeper |:Keeper] /.test(messages)) {
      // keeperを設定する
      keeper = message.mentions.users.array()[0];
      if (keeper == null) {
        keeper = message.author;
      }
      let reply_text = keeper + '様をkeeperとして設定しました。';

      channel.send(reply_text)
          .then(message => console.log('Sent message: ' + reply_text))
          .catch(console.error);

      keeper.send('あなたはkeeperになりました')
          .then(msg => console.log(`Sent a reply to ${ keeper.author }`))
          .catch(console.error);
      return;
    } else if (!message.author.bot) {
      var options = {
        url :
            'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY='+api_key,
        json : {utt : messages, context : context, mode : mode}
      };

      //リクエスト送信
      request.post(options, function(error, response, body) {
        context = body.context;
        mode = body.mode;

        channel.send(body.utt)
            .then(msg => console.log(`Sent message : ${ body.utt }`))
            .catch(console.error);
      });
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
