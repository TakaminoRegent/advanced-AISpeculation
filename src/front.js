const { createApp, reactive } = Vue;
const  SelfBuildingSquareSpinner = window['epic-spinners'].SelfBuildingSquareSpinner;
console.log(window['epic-spinners'].SelfBuildingSquareSpinner)
console.log(SelfBuildingSquareSpinner)
// const { axios } = Axios;
const MAXLEN = 3;
const TIMES = 4; //繰り返す回数

const QuizData = reactive({
    word_list: ["tomato", "internet", "urban", "design", "game", "glass", "money", "book", "beach"],
    select_list: [], //画像生成に選んだ単語リスト
    spec_list: [], //推測者が選んだリスト
    imgsrc: "",
    a_img: [], //aが生成した画像のsrc
    a_wordlist: [],
    b_img: [], //bが生成した画像のsrc
    b_wordlist: [],
    turn_flag: false, //選ぶ人 false-> A, true->B
    end_flag: 0,      //終了判定フラグ
    componentId: "start",
    a_point: 0,
    b_point: 0,
    a_name: "",
    b_name: "",
    result_doc: "次のターンに進む",
});

const app = createApp({
    data() {
        return {
            componentId: QuizData.componentId,
            turn_flag: QuizData.turn_flag,
            how_to: false,
        }
    },
    methods:{
        toggle_how(){
            let btn = document.querySelector('.toggle')
            if(!this.how_to){
                btn.style.background = "#000";
                btn.style.color = "#fff";
            }else{
                btn.style.background = "#fff";
                btn.style.color = "#000";
            }
            this.how_to = !this.how_to;
        }
    },
    computed: {
        currentId() {
            return QuizData.componentId;
        },
        currentflag() {
            return QuizData.turn_flag;
        }
    },
    
});

app.component(
    'epic-spin',
    {
        template:`
        <div class="self-building-square-spinner spinner">
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square clear"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square clear"></div>
            <div class="square"></div>
            <div class="square"></div>
        </div>
        `
    }
)

app.component(
    'how-to',
    {
        data(){
            return{

            }
        },
        template: `
            <div class="show_how">
                <h2 class="h2play">遊び方</h2>
                このゲームは二人用です。
                一台のPC、スマートフォンで遊ぶことを想定しています。
                画像生成AI(<a href="https://labs.openai.com/">DALL-E</a>)を用いています。
                <ol>
                    <li>プレイヤー1が9個の単語の中から1~3個選びます。</li>
                    <li>選んだ単語を基に画像が自動生成され、プレイヤー2が推測するターンになります</li>
                    <li>プレイヤー2は生成された画像を見て、生成に使われた単語を推測します。</li>
                    <li>プレイヤー1が選んだ単語とプレイヤー2が選んだ単語が照合され、一致した単語数がプレイヤー2のポイントとして加算されます。</li>
                    <li>プレイヤー1とプレイヤー2の役割を交代します。</li>
                    <li> 1~5を4回繰り返し、最終ポイントが高いほうが勝利です。</li>
                </ol>
                <h3 class="h2play">Let's enjoy!!</h3>
            </div>
        `
    }
)

app.component(
    'start',
    {
        data() {
            return {
                a_name: "",
                b_name: "",
            }
        },
        methods: {
            start(){
                if(this.a_name == "") this.a_name = "プレイヤー1";
                if(this.b_name == "") this.b_name = "プレイヤー2";
                QuizData.a_name = this.a_name;
                QuizData.b_name = this.b_name;

                QuizData.componentId = "select-word";
            }
        },
        template: `
            <div class="start">
                <p class="title">AI Speculation Quiz</p>
                <div>
                    <div class="inputs">
                        <input v-model="a_name" class="inputname" type="text" placeholder="プレイヤー1" />
                        <input v-model="b_name" class="inputname" type="text" placeholder="プレイヤー2" />
                    </div>
                    <div>
                        <button @click="start" class="btn btn-border make">始める</button>
                    </div>
                </div>
                
                

                <h3>Let's enjoy!!</h3>

                <h2><a href="#inline" class="inline">遊び方</a></h2>

                <div class="modaal" id="inline" style="display:none;">
                このゲームは二人用です。
                一台のPC、スマートフォンで遊ぶことを想定しています。
                画像生成AI(<a href="https://labs.openai.com/">DALL-E</a>)を用いています。
                    <ol>
                        <li>プレイヤー1が9個の単語の中から1~3個選びます。</li>
                        <li>選んだ単語を基に画像が自動生成され、プレイヤー2が推測するターンになります</li>
                    </ol>
                    <div class="right">
                        <div class="btn-box">
                            <a href="#inline2" class="inline2 btn btn-border make">次へ</a>
                        </div>
                    </div>
                </div>

                <div class="modaal" id="inline2" style="display:none;">
                    <ol>
                        <li>プレイヤー2は生成された画像を見て、生成に使われた単語を推測します。</li>
                        <li>プレイヤー1が選んだ単語とプレイヤー2が選んだ単語が照合され、一致した単語数がプレイヤー2のポイントとして加算されます。</li>
                    </ol>
                    <div class="flex-btn">
                        <div class="left">
                            <div class="btn-box">
                                <a href="#inline" class="inline btn btn-border make">戻る</a>
                            </div>
                        </div>
                        <div class="right">
                            <div class="btn-box">
                                <a href="#inline3" class="inline3 btn btn-border make">次へ</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modaal" id="inline3" style="display:none;">
                    <ol>                  
                        <li>プレイヤー1とプレイヤー2の役割を交代します。</li>
                        <li> 1~5を4回繰り返し、最終ポイントが高いほうが勝利です。</li>
                    </ol>
                    <div class="left">
                        <div class="btn-box">
                            <a href="#inline2" class="inline2 btn-box btn btn-border make">戻る</a>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
)

//画像を生成するための単語を選ぶコンポーネント
app.component(
    'select-word',
    {
        data() {
            return {
                word_list: QuizData.word_list,
                select_list: [],
                turn_flag: QuizData.turn_flag,
                btn_list: document.querySelectorAll('.word'), //選択ボタンのDOMリストを取得
                make_mes: "作成する",
                loading: false,
                imgsrc: QuizData.imgsrc,
                made: false, //作成フラグ
                notok: false,
                a_name: QuizData.a_name,
                b_name: QuizData.b_name,
            }
        },
        methods: {
            input_answer(word) {
                this.btn_list = document.querySelectorAll('.word');
                let old_word = "";
                if (!this.select_list.includes(word)) {
                    if (this.select_list.length >= MAXLEN) {
                        old_word = this.select_list[0];
                        this.select_list.push(word);
                        this.select_list.shift();
                    }
                    else {
                        this.select_list.push(word);
                    }
                } else {
                    old_word = word;
                    this.select_list.splice(this.select_list.indexOf(old_word), 1);
                }

                // this.select_list = Array.from(new Set(this.select_list));

                for (let i = 0; i < this.btn_list.length; i++) {
                    if (old_word == this.btn_list[i].id) {
                        this.btn_list[i].style.color = "#000";
                        this.btn_list[i].style.background = "#fff";
                    } else if (word == this.btn_list[i].id) {
                        this.btn_list[i].style.color = "#fff";
                        this.btn_list[i].style.background = "#000";
                    }
                }
                return console.log(word);
            },
            makeimg(){
                if(this.select_list.length > 0){
                    this.loading = true;
                    this.notok = false;
                    let words = `${this.select_list[0]} ${this.select_list[1]} ${this.select_list[2]}`
                    let post = axios.post("/", { word: words }).then((response) => {
                        console.log("postで送信");
                        this.loading = false;
                        console.log(response);
                        this.catchimg(response.data);
                    }).catch((err) => {
                        console.log("エラー");
                        console.log(err);
                    });
                } else {
                    this.notok = true;
                }
            },
            catchimg(img) {
                //imgはbase64形式
                QuizData.select_list = this.select_list; //正解を格納
                QuizData.imgsrc = "data:image/png;base64," + img;
                this.make_mes = "作り直す"
                this.imgsrc = QuizData.imgsrc;
                this.made = true;

            },
            set_q(){
                if(!QuizData.turn_flag){
                    QuizData.b_wordlist.push(this.select_list);
                    QuizData.b_img.push(this.imgsrc);
                }else{
                    QuizData.a_wordlist.push(this.select_list);
                    QuizData.a_img.push(this.imgsrc);
                }
                QuizData.componentId = "answer";
            },
            computed: {
                ret_img() {
                    return this.imgsrc
                }
            }
        },
        template: `
        <h1 v-if="!turn_flag" class="player1"><span style="font-size:2em;">{{ a_name }}</span>  が出題者です</h1>
        <h1 v-else class="player2"><span style="font-size:2em;">{{ b_name }}</span>  が出題者です</h1>
        <h3>単語を1～3つ選んでください</h3>
        <div class="wordbtn">
            <div v-for="i in word_list" :key="i" class="btndiv">
                <button @click="input_answer(i)" :id="i" class="btn btn-border word">{{ i }}</button>
            </div>
        </div>
        <div class="selected_list">
            <span v-for="i in select_list" :key="i" class="selected">
                {{ i }}
            </span>
        </div>
        <div>
            <button @click="makeimg" class="btn btn-border make">
                {{ make_mes }}
            </button>
            <button v-if="made" @click="set_q" class="btn btn-border make">
                出題する
            </button>
            <div v-if="notok">
                単語を一つ以上選んでください
            </div>
            <div v-if="loading">
                <epic-spin></epic-spin>
            </div>
            <div v-if="made">
                <img id="img" :src="imgsrc" width="256" height="256"/>
            </div>
        </div>
        `
    }
)

// 推測者のターンを表示するコンポーネント
app.component(
    'turn-guess',
    {
        data() {
            return {

            }
        },
        template: `
            <h4>単語を当てる人のターンです</h4>
            <p>画像を作った単語を、最大3つまで推測して選んでください</p>
        `
    }
)
//推測画面を表示するコンポーネント
app.component(
    'answer',
    {
        data() {
            return {
                word_list: QuizData.word_list,
                turn_flag: QuizData.turn_flag,
                select_list: [], //回答者が選択した単語リスト
                imgsrc: QuizData.imgsrc,
                point: 0,
                a_name: QuizData.a_name,
                b_name: QuizData.b_name,
            }
        },
        methods: {
            input_answer(word) {
                this.btn_list = document.querySelectorAll('.word');
                let old_word = "";
                if (!this.select_list.includes(word)) {
                    if (this.select_list.length >= MAXLEN) {
                        old_word = this.select_list[0];
                        this.select_list.push(word);
                        this.select_list.shift();
                    }
                    else {
                        this.select_list.push(word);
                    }
                } else {
                    old_word = word;
                    this.select_list.splice(this.select_list.indexOf(old_word), 1);
                }

                // this.select_list = Array.from(new Set(this.select_list));

                for (let i = 0; i < this.btn_list.length; i++) {
                    if (old_word == this.btn_list[i].id) {
                        this.btn_list[i].style.color = "#000";
                        this.btn_list[i].style.background = "#fff";
                    } else if (word == this.btn_list[i].id) {
                        this.btn_list[i].style.color = "#fff";
                        this.btn_list[i].style.background = "#000";
                    }
                }
                return console.log(word);
            },
            guess_answer() {
                for (let i = 0; i < this.select_list.length; i++) {
                    let len = QuizData.select_list.length;
                    let checklist = QuizData.select_list.slice();

                    console.log(QuizData.select_list);
                    // QuizData.spec_list.push(this.select_list[i]);
                    checklist.push(this.select_list[i]);
                    let newlist = new Set(checklist);
                    if (newlist.size == len) {
                        this.point++;
                    }
                }
                QuizData.point = this.point;
                console.log(`現在の得点は${QuizData.point}です`);

                //turn_flagがfalseのときBのポイント,trueの時Aのポイントに加算
                if (QuizData.turn_flag) {
                    QuizData.a_point += QuizData.point;
                } else {
                    QuizData.b_point += QuizData.point;

                }
                console.log(`現在のAの得点は${QuizData.a_point}です`);
                console.log(`現在のBの得点は${QuizData.b_point}です`);
                QuizData.spec_list = this.select_list;
                QuizData.componentId = "result";
            }
        },
        template: `
            <h1 v-if="turn_flag" class="player1"><span style="font-size:2em;">{{ a_name }}</span>  が回答者です</h1>
            <h1 v-else class="player2"><span style="font-size:2em;">{{ b_name }}</span>  が回答者です</h1>
            <img id="img" :src="imgsrc" width="256" height="256"/>
            <div class="wordbtn">
                <div v-for="i in word_list" :key="i" class="btndiv">
                    <button @click="input_answer(i)" :id="i" class="btn btn-border word">{{ i }}</button>
                </div>
            </div>
            <h2 class="h2class">選んでいる単語</h2>
            <div class="selected_list">
                <span v-for="i in select_list" :key="i" class="selected">
                    {{ i }}
                </span>
            </div>
            <button type="button" @click=guess_answer class="btn btn-border make">推測する</button>
        `
    }
)

app.component(
    'result',
    {
        data() {
            return {
                point: QuizData.point,
                imgsrc: QuizData.imgsrc,
                turn_flag: QuizData.turn_flag,
                a_point: QuizData.a_point,
                b_point: QuizData.b_point,
                select_list: QuizData.select_list,
                spec_list: QuizData.spec_list,
                a_name: QuizData.a_name,
                b_name: QuizData.b_name,
                result_doc: QuizData.result_doc,
            }
        },
        methods: {
            next_turn() {
                QuizData.end_flag++;
                if (QuizData.end_flag >= TIMES) {
                    console.log("おわりました");
                    QuizData.componentId = "byebye"
                }else{
                    if(QuizData.end_flag + 1 == TIMES){
                        QuizData.result_doc = "結果を見る"
                    }
                    QuizData.turn_flag = !QuizData.turn_flag;
                    QuizData.componentId = "select-word";
                }
            }
        },
        template: `
            <img id="img" :src="imgsrc" width="256" height="256" />
            <div>
                <h1 class="result_doc">この画像の生成に用いた単語は</h1>
                <div class="answer">
                    <span v-for="i in select_list" class="new-selected">{{ i }}</span>
                </div>
            </div>
            <h1 v-if="turn_flag" class="result_doc">{{ a_name }}の推測した単語は</h1>
            <h1 v-else class="result_doc">{{ b_name }}の推測した単語は</h1>
            <div class="answer">
                <span v-for="i in spec_list" class="new-selected">{{ i }}</span>
            </div>
            <p><span class="point">{{ point }}</span><span class="wwwww">point</span></p>
            <button type="button" @click=next_turn class="btn btn-border make">{{ result_doc }}</button>
        `
    }
)
app.component( //最終ページ
    'byebye',
    {
        data() {
            return {
                a_point: QuizData.a_point,
                b_point: QuizData.b_point,
                a_name: QuizData.a_name,
                b_name: QuizData.b_name,
                a_img: QuizData.a_img,
                b_img: QuizData.b_img,
                a_wordlist: QuizData.a_wordlist,
                b_wordlist: QuizData.b_wordlist,
            }
        },

        methods: {
            next_game() {
                //次のゲームに向けて初期化
                QuizData.a_point = 0;
                QuizData.b_point = 0;
                QuizData.end_flag = 0;
                QuizData.turn_flag = false;
                QuizData.componentId = "start";    
                QuizData.a_img = [];
                QuizData.a_wordlist = [];
                QuizData.b_img = [];
                QuizData.b_wordlist = [];
            }
        },
        template:`
        <div class="result_page">
            <div class="result_point">
                {{ a_name }}のポイントは{{ a_point }}点です
                <div v-for="(i, index) in a_img" class="result_img">
                    <img :src="i" width="256" height="256" />
                    <div class="answer">
                        <span v-for="i in a_wordlist[index]" class="new-selected">{{ i }}</span>
                    </div>
                </div>
            </div>
            <div class="result_point">
                {{ b_name }}のポイントは{{ b_point }}点です
                <div v-for="(i, index) in b_img" class="result_img">
                    <img :src="i" width="256" height="256" />
                    <div class="answer">
                        <span v-for="i in b_wordlist[index]" class="new-selected">{{ i }}</span>
                    </div>
                </div>
            </div>
        </div>
            <h1 v-if = "a_point > b_point">Aの勝利です</h1>
            <h1 v-else-if="a_point < b_point" >Bの勝利です</h1>
            <h1 v-else>引き分けだぁ！</h1>
            <button type="button" @click=next_game class="btn btn-border aiueo">ホームに戻る</button>
        `
    })

app.mount("#main");