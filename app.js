const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playToggle = $('.btn-toggle-play')

const progress = $('#progress');
const cdThum = $('.cd-thumb');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    songs: [
        {
            name: 'Ai rồi cũng sẽ khác',
            singer: 'Hà Nhi',
            path: './assets/music/1AiRoiCungSeKhac.mp3',
            image: './assets/image/1.jpg'
        },
        {
            name: 'Ngày mai người ta lấy chồng',
            singer: 'Hoài Lầm',
            path: './assets/music/2NgayMaiNguoiTaLayChong.mp3',
            image: './assets/image/2.jpg'
        },
        {
            name: 'Hoa nở không màu',
            singer: 'Hoài Lâm',
            path: './assets/music/3HoaNoKhongMau.mp3',
            image: './assets/image/3.jpg'
        }
        ,
        {
            name: 'Người yêu cũ',
            singer: 'Phân Mạnh Quỳnh',
            path: './assets/music/4NguoiYeuCu.mp3',
            image: './assets/image/4.jpg'
        },
        {
            name: 'Cánh Hồng Phai',
            singer: 'Phương Ý',
            path: './assets/music/5CanhHongPhai.mp3',
            image: './assets/image/5.jpg'
        },
        {
            name: 'Cha Giá Rồi Đúng Không',
            singer: 'Anh Tú',
            path: './assets/music/6ChaGiaRoiDungKhong.mp3',
            image: './assets/image/6.jpg'
        },
        {
            name: 'Sao Em Lại Tắt Má',
            singer: 'Phạm Nguyên Ngọc Vanh',
            path: './assets/music/7SaoemTatmay.mp3',
            image: './assets/image/7.jpg'
        },
        {
            name: 'Giữa Đại Lộ Đông Tây',
            singer: 'Uyên Linh',
            path: './assets/music/8GiuaDaiLoDongTay.mp3',
            image: './assets/image/8.jpeg'
        }
    ],

    currentIndex: 0,
    isPlaying: false, //để làm mặc định btn play là pause
    isRandom: false,
    isRepeat: false,
    render: function () { //2
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option"><i class="fas fa-ellipsis-h"></i></div>
                </div>
            `
        })
        playList.innerHTML = html.join('');
    },
    handleEvents: function () { //1
        const _this = this //this là const app
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        //xử lý cd rotate 8
        const cdThumAnimate = cdThum.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            interations: Infinity //cd quay vô hạn
        })
        cdThumAnimate.pause(); //cho dừng chạy và cho play chỗ khi click vào play


        document.onscroll = function () { //sự kiện phóng to thu nhỏ cd list bài hát  1.1
            // console.log(window.scrollY);
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }


        //xử lý khi click play 5
        const player = $('.player');
        playToggle.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //khi song được play  5.1
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumAnimate.play();
        }

        //khi song bi pause  5.2
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi  6
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent; //value là các cài đặt trong input progress
            }
        }

        //khi tua song 7
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }

        //khi next song 10
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render(); //cái này là sự kiện active khi abif hát đang hát
        }

        //khi prev song 10
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.preSong();
            }
            audio.play();
             _this.render(); //cái này là sự kiện active khi abif hát đang hát
        }

        //khi click vào random 11
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active'), _this.randomBtn; //toggle thay cho add và remove, khi true thì add active mà khi false thì remove active
        }

        //xử lý repeat khi audio ended 133 giống random
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.repeatBtn);
        }//và xử lý repeatBtn này ở sự kiến oneded audio


        //xử lý next song khi audio ended 12
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //lắng nghe hành vi khi click vào bai hát tùy chọn
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active')
            console.log(songNode)
            if(songNode || e.target.closest('.option')){//option là dấu ba chấm bên phải bài hát
                //xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index) //  dataset.index được đặt trên html
                    _this.loadCurrentSong()
                    _this.render();
                    audio.play()
                }

                //xử lý khi click vào option
                if(e.target.closest('.option')){

                }
            } 
        }



    },

    defineProperties: function () { //3
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function () { //4
        const heading = $('header h2');
        const audio = $('#audio');

        //gán bài hát vào 
        heading.textContent = this.currentSong.name
        cdThum.style.backgroundImage = `url('${this.currentSong.image}')`

        audio.src = this.currentSong.path
        // console.log(playToggle, cdThum , audio)
    },

    nextSong: function () { //9
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    preSong: function () { //9
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () { //11
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) {
            this.currentIndex = newIndex
            this.loadCurrentSong();
        } //và khai báo vào nút next và prev
    },
    start: function () {
        ////Định nghĩa các thuộc tính cho object 
        this.defineProperties();

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        this.loadCurrentSong();
        //Render playlist
        this.render();
    }
}

app.start();