// Topic content, copied verbatim from the design (project/Folio English.dc.html).

export type Pair = [en: string, vi: string];

export interface TopicWord {
  w: string;
  ipa: string;
  pos: string;
  vi: string;
  topic: string;
  ex: string;
}

export interface Topic {
  id: string;
  en: string;
  vi: string;
  mins: number;
  words: TopicWord[];
  phrases: Pair[];
  dialog: Pair[];
}

type RawWord = [w: string, ipa: string, pos: string, vi: string];
type RawTopic = [id: string, en: string, vi: string, words: RawWord[], phrases: Pair[], dialog: Pair[]];

const raw: RawTopic[] = [
  ['greet', 'Greetings & small talk', 'Chào hỏi & hỏi thăm', [
    ['hello', '/həˈloʊ/', 'interj', 'xin chào'], ['fine', '/faɪn/', 'adj', 'ổn, khỏe'], ['tired', '/taɪɚd/', 'adj', 'mệt'],
    ['busy', '/ˈbɪz.i/', 'adj', 'bận'], ['friend', '/frend/', 'n', 'bạn bè'], ['weekend', '/ˈwiːk.end/', 'n', 'cuối tuần']],
    [["How are you doing?", 'Dạo này bạn thế nào?'], ["I'm fine, thanks. And you?", 'Mình ổn, cảm ơn. Còn bạn?'], ['Nice to meet you.', 'Rất vui được gặp bạn.'], ['How was your weekend?', 'Cuối tuần của bạn thế nào?']],
    [['Hi Lan! How are you doing?', 'Chào Lan! Dạo này thế nào?'], ["I'm fine, thanks. A bit tired. And you?", 'Mình ổn, cảm ơn. Hơi mệt. Còn bạn?'], ['Busy, but fine. How was your weekend?', 'Bận nhưng ổn. Cuối tuần của bạn thế nào?'], ['Great! I visited my family.', 'Tuyệt lắm! Mình về thăm gia đình.']]],
  ['weather', 'Weather', 'Thời tiết', [
    ['sunny', '/ˈsʌn.i/', 'adj', 'nắng'], ['rainy', '/ˈreɪ.ni/', 'adj', 'có mưa'], ['hot', '/hɑːt/', 'adj', 'nóng'],
    ['cold', '/koʊld/', 'adj', 'lạnh'], ['cloudy', '/ˈklaʊ.di/', 'adj', 'nhiều mây'], ['umbrella', '/ʌmˈbrel.ə/', 'n', 'cái ô']],
    [["What's the weather like today?", 'Hôm nay thời tiết thế nào?'], ["It's very hot today.", 'Hôm nay nóng quá.'], ['It looks like rain.', 'Trời có vẻ sắp mưa.'], ["Don't forget your umbrella.", 'Đừng quên mang ô nhé.']],
    [["What's the weather like today?", 'Hôm nay thời tiết thế nào?'], ["It's sunny now, but it looks like rain later.", 'Giờ đang nắng, nhưng lát nữa có vẻ mưa.'], ["Really? I don't have an umbrella.", 'Thật à? Mình không có ô.'], ['Take mine. I have two.', 'Cầm của mình đi. Mình có hai cái.']]],
  ['fashion', 'Clothes & fashion', 'Thời trang', [
    ['shirt', '/ʃɝːt/', 'n', 'áo sơ mi'], ['dress', '/dres/', 'n', 'váy liền'], ['shoes', '/ʃuːz/', 'n', 'giày'],
    ['jacket', '/ˈdʒæk.ɪt/', 'n', 'áo khoác'], ['size', '/saɪz/', 'n', 'kích cỡ'], ['try on', '/traɪ ɑːn/', 'phr. v', 'mặc thử']],
    [['Can I try this on?', 'Tôi mặc thử cái này được không?'], ['Do you have a smaller size?', 'Có cỡ nhỏ hơn không?'], ['It fits well.', 'Cái này vừa lắm.'], ['I love your jacket!', 'Áo khoác của bạn đẹp quá!']],
    [['Excuse me, can I try this jacket on?', 'Xin lỗi, tôi mặc thử áo khoác này được không?'], ['Of course. What size are you?', 'Tất nhiên. Bạn mặc cỡ nào?'], ['Medium, I think.', 'Chắc là cỡ M.'], ['Here you are. The fitting room is over there.', 'Của bạn đây. Phòng thử đồ ở đằng kia.']]],
  ['food', 'Food & drinks', 'Ăn uống', [
    ['menu', '/ˈmen.juː/', 'n', 'thực đơn'], ['order', '/ˈɔːr.dɚ/', 'v', 'gọi món'], ['delicious', '/dɪˈlɪʃ.əs/', 'adj', 'ngon'],
    ['spicy', '/ˈspaɪ.si/', 'adj', 'cay'], ['bill', '/bɪl/', 'n', 'hoá đơn'], ['water', '/ˈwɑː.t̬ɚ/', 'n', 'nước']],
    [['Can I see the menu, please?', 'Cho tôi xem thực đơn được không?'], ["I'd like a coffee, please.", 'Cho tôi một ly cà phê.'], ['Is it spicy?', 'Món này có cay không?'], ['Can I have the bill?', 'Cho tôi xin hoá đơn.']],
    [['Are you ready to order?', 'Anh/chị gọi món chưa ạ?'], ["Yes. I'd like the chicken noodle soup.", 'Rồi. Cho tôi phở gà.'], ['Anything to drink?', 'Anh/chị uống gì không?'], ['Just water, please.', 'Cho tôi nước lọc thôi.']]],
  ['work', 'At work', 'Công việc', [
    ['meeting', '/ˈmiː.t̬ɪŋ/', 'n', 'cuộc họp'], ['email', '/ˈiː.meɪl/', 'n', 'thư điện tử'], ['deadline', '/ˈded.laɪn/', 'n', 'hạn chót'],
    ['colleague', '/ˈkɑː.liːɡ/', 'n', 'đồng nghiệp'], ['schedule', '/ˈskedʒ.uːl/', 'n', 'lịch làm việc'], ['report', '/rɪˈpɔːrt/', 'n', 'báo cáo']],
    [["Let's have a meeting at ten.", 'Mình họp lúc 10 giờ nhé.'], ["I'll send you an email.", 'Tôi sẽ gửi email cho bạn.'], ['When is the deadline?', 'Hạn chót là khi nào?'], ['Can we talk later?', 'Lát nữa mình nói chuyện được không?']],
    [['Do you have time for a quick meeting?', 'Bạn có thời gian họp nhanh không?'], ['Sure. What about?', 'Được chứ. Về việc gì?'], ['The new report. The deadline is Friday.', 'Bản báo cáo mới. Hạn chót là thứ Sáu.'], ["OK. Let's meet at two.", 'OK. Hẹn gặp lúc 2 giờ.']]],
  ['travel', 'Travel', 'Du lịch', [
    ['ticket', '/ˈtɪk.ɪt/', 'n', 'vé'], ['airport', '/ˈer.pɔːrt/', 'n', 'sân bay'], ['hotel', '/hoʊˈtel/', 'n', 'khách sạn'],
    ['passport', '/ˈpæs.pɔːrt/', 'n', 'hộ chiếu'], ['map', '/mæp/', 'n', 'bản đồ'], ['luggage', '/ˈlʌɡ.ɪdʒ/', 'n', 'hành lý']],
    [['Where is the bus stop?', 'Trạm xe buýt ở đâu?'], ['How much is a ticket?', 'Vé bao nhiêu tiền?'], ['I have a reservation.', 'Tôi đã đặt phòng trước.'], ['Can you help me, please?', 'Bạn giúp tôi được không?']],
    [['Hello, I have a reservation. My name is Minh.', 'Xin chào, tôi đã đặt phòng. Tên tôi là Minh.'], ['Welcome! Can I see your passport?', 'Chào mừng! Cho tôi xem hộ chiếu được không?'], ['Here you are.', 'Của bạn đây.'], ['Thank you. Your room is 305.', 'Cảm ơn. Phòng của bạn là 305.']]],
];

export const TOPICS: Topic[] = raw.map(([id, en, vi, words, phrases, dialog]) => {
  const lines = phrases.concat(dialog).map((x) => x[0]);
  return {
    id, en, vi, mins: 15, phrases, dialog,
    words: words.map(([w, ipa, pos, wvi]) => ({
      w, ipa, pos, vi: wvi, topic: id,
      ex: lines.find((l) => l.toLowerCase().includes(w.toLowerCase())) || '',
    })),
  };
});

/** "Câu của ngày" — the design's sentence first, then rotates daily. */
export const DAILY_SENTENCES: Pair[] = [
  ["It's not about having time. It's about making time.", 'Vấn đề không phải là có thời gian, mà là dành ra thời gian.'],
  ['Little by little, one travels far.', 'Từng chút một, rồi sẽ đi được xa.'],
  ['Practice makes progress.', 'Luyện tập tạo nên tiến bộ.'],
  ["Don't be afraid to make mistakes.", 'Đừng sợ mắc lỗi.'],
  ['Every day is a fresh start.', 'Mỗi ngày là một khởi đầu mới.'],
  ['Small steps every day.', 'Mỗi ngày một bước nhỏ.'],
  ['The best time to start is now.', 'Thời điểm tốt nhất để bắt đầu là bây giờ.'],
];
