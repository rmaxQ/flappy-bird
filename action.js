const stage = document.querySelector("#stage");                                         //div przetrzymujący canvasy
const canvas = document.querySelector("#game");                                         //canvas do wypisywania części gry, ptaka, słupów, napisów
const back = document.querySelector("#background");                                     //canvas backgroundu
let multiplier = window.outerWidth/1920;                                                //pobranie przeskalowania obrazu
canvas.width *= multiplier;
canvas.height *= multiplier;
back.width *= multiplier;
back.height *= multiplier;
const width = canvas.width;
const height = canvas.height;
stage.style.width = width;
stage.style.height = height;
stage.style.position = "relative";
canvas.style.right = ((window.outerWidth - canvas.width)/2)+"px";
back.style.right = ((window.outerWidth - canvas.width)/2)+"px";
const ctx = canvas.getContext("2d");
const bctx = back.getContext("2d");

ctx.lineCap = "round";
ctx.lineWidth = 2*multiplier;
let animation = false;
const gravity = 1*multiplier;
let random;
let bird;
let pole1;
let pole2;
let game = true;

class Bird{                                                                             //klasa ptaka
    constructor(){                                                                      //konstruktor klasy ptaka
        this.position= {
            x: 200*multiplier,
            y: 400*multiplier                                                           //ustawienie pozycji
        };
        this.width = 76*multiplier;
        this.height = 56*multiplier;                                                    //ustawienie szerokości i wysokości grafiki ptaka
        this.velocity = 0                                                               //prędkość
        this.alive = true;                                                              //czy ptak jest żywy
        this.points = 0;                                                                //punkty zdobyte podczas gry
    }

    draw(){                                                                             //funkcja klasy ptaka wypisująca go na canvas
        let x = this.position.x;
        let y = this.position.y;
        let wd = this.width;
        let ht = this.height;
        image.addEventListener('load', function(){                                      //ładowanie grafiki
            ctx.drawImage(image, x, y, wd, ht);
        }, true);
        ctx.textAlign = 'center';
        ctx.font = `${150*multiplier}px Fantasy`;
        if(animation==true && game==true){                                              //jeśli gra jest w toku to wypisuje punkty
            ctx.fillStyle = 'black';
            ctx.fillText(this.points, width/2+5*multiplier, 155*multiplier); 
            ctx.fillStyle = 'white';
            ctx.fillText(this.points, width/2, 150*multiplier);
        }
        ctx.drawImage(image, x, y, wd, ht);                                             //wypisanie grafiki ptaka
    }
    
    update(){                                                                           //funkcja aktualizująca stan ptaka
        if(this.position.y + this.velocity<=0){                                         //gdy ptak ma uderzyć w górę to jego prędkość zmieniam na 0
            this.velocity = 0;
        }
        else{                                                                           //w przeciwnym wypadku zmieniam pozycje i prędkość ptaka
            this.position.y += this.velocity;
            this.velocity += gravity;
        }
        this.draw();
    }

    collide(pole){                                                                      //funkcja kolizji
        if(pole.position.x >= this.position.x-(pole.width+16*multiplier) && pole.position.x <= this.position.x + this.width - 4*multiplier){
            if(pole.position.y1 >= this.position.y-4*multiplier || pole.position.y2 <= this.position.y + this.height+4*multiplier){
                this.alive = false;                                                     //sprawdzenie czy ptak uderza w słupy i jeśli tak to zmiana jego prędkości
                pole.velocity = 0;                                                      //na 0 i ustawienie że jest martwy
            }
        }
        if(pole.position.x + pole.width + 10*multiplier < this.position.x && this.alive == true && pole.scorePoint == true){
            pole.scorePoint = false;                                                    //jeśli nie uderzy to zmieniam zmienną odpoiedzialną za przyznawanie 
            this.points += 1;                                                           //punktów na false żeby dla jednego słupka tylko raz się zaliczał punkt
        }                                                                               //i dodaje 1 do pulu punktów
    }

    dead(){                                                                             //fukcja występująca po śmierci, gdy ptak opuści planszę 
        ctx.fillStyle = 'black';                                                        //wypisuje "Press space to try again points: ilość punktów"
        ctx.font = `${100*multiplier}px Fantasy`;
        ctx.textAlign = 'center';
        ctx.fillText('Press space', width/2+5*multiplier, 105*multiplier); 
        ctx.fillStyle = 'white';
        ctx.fillText('Press space', width/2, 100*multiplier);
        ctx.fillStyle = 'black';
        ctx.fillText('to try again', width/2+5*multiplier, 305*multiplier); 
        ctx.fillStyle = 'white';
        ctx.fillText('to try again', width/2, 300*multiplier);
        ctx.fillStyle = 'black';
        ctx.fillText('points: '+this.points, width/2+5*multiplier, 505*multiplier); 
        ctx.fillStyle = 'white';
        ctx.fillText('points: '+this.points, width/2, 500*multiplier);
        game = false;
    }
}

class Pole{                                                                             //klasa słupków
    constructor(){                                                                      //konstruktor klasy słupków
        random = Math.floor((Math.random()*1000000)%(height-260*multiplier))+130*multiplier;
        this.position = {                                                               //pozycja y słupków jest ustalana losowo, żeby nie bylo powtarzalnie 
            x: width,
            y1: random -110*multiplier,
            y2: random +110*multiplier
        };                                                                              //ustawienie szerokości i wysokości słupków
        this.width = 100*multiplier;
        this.height = {
            up: random -110*multiplier,
            down: height - random -110*multiplier
        };
                                                                                        //ustawienie prędkości i tego czy mogą zostać przyznane punkty za minięcie
        this.velocity = 10*multiplier;
        this.scorePoint = true;
    }
    draw(){                                                                             //funkcja wypisująca słupki z gradientem, nie jest to grafika
        let grd = ctx.createLinearGradient(this.position.x, 0, this.position.x+this.width, 0);//tylko sam kod sprawia, że rysuje słupki
        grd.addColorStop(0, "#11640A");
        grd.addColorStop(0.4, "#75FA6B");
        grd.addColorStop(1, "#11640A");
        ctx.fillStyle=grd;
        ctx.fillRect(this.position.x, 0, this.width, this.height.up-40*multiplier);
        ctx.fillRect(this.position.x, this.position.y2+40*multiplier, this.width, this.height.down-40*multiplier);
        grd = ctx.createLinearGradient(this.position.x-10, 0, this.position.x+this.width+10, 0);
        grd.addColorStop(0, "#11640A");
        grd.addColorStop(0.4, "#75FA6B");
        grd.addColorStop(1, "#11640A");
        ctx.fillStyle=grd;
        ctx.fillRect(this.position.x-10*multiplier, this.position.y1-40*multiplier, this.width+20*multiplier, 40*multiplier);
        ctx.fillRect(this.position.x-10*multiplier, this.position.y2, this.width+20*multiplier, 40*multiplier);
        ctx.strokeStyle = "#11640A"
        ctx.beginPath();
        ctx.rect(this.position.x-10*multiplier, this.position.y1-40*multiplier, this.width+20*multiplier, 40*multiplier);
        ctx.rect(this.position.x-10*multiplier, this.position.y2, this.width+20*multiplier, 40*multiplier);
        ctx.closePath();
        ctx.stroke();
    }
    
    update(){                                                                           //funkcja aktualizująca słupki
        if(bird.alive==true){                                                           //jeżeli ptak jest żywy zmienia się pozycja x słupków
            this.position.x -= this.velocity;
        }
        if(this.position.x<=-(this.width)) {                                            //jak pozycja x jest mniejsza od minusowej wartości szerokości słupka to
            random = Math.floor((Math.random()*1000000)%(height-260*multiplier))+130*multiplier;
            this.position.y1 = random -110*multiplier;                                  //przypisywana jest nowa pozycja losowa y i pozycja x zmieniona zostaje na 
            this.position.y2 = random +110*multiplier;                                  //szerokość canvasu oraz że ze słupka można dostać punkt
            this.height.up = random - 110*multiplier;
            this.height.down = height - random -110*multiplier;
            this.position.x = width;
            this.scorePoint = true;
        }
        if(this.position.x <= width/2 - 60*multiplier && pole2==null){                  //ogólnie wykorzytuje tylko 2 słupki i drugi słupek się pojawia
            pole2 = new Pole();                                                         //właśnie po wykonaniu tego ifa który sprawdza czy pozycja x pierwszego
        }                                                                               //słupka jest mniejsza od połowy szerokości 
        this.draw();
    }
}

function start(){                                                                       //funkcja wypisująca background
    bctx.fillStyle="#68DBFA";
    bctx.fillRect(0,0, width, height);
    for(let i=1; i<=15; i++){
        
        if(i>13){
            bctx.fillStyle="#67D13C";
            bctx.fillRect(0,(height*(i-1))/15, width, (height*i)/15);
        }
    }
}

function view_logo(){                                                                   //funkcja wypisująca początkowy komunikat
    ctx.fillStyle = '#67AB4B';
    ctx.font = `${100*multiplier}px Fantasy`;
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird', width/2+5*multiplier, 105*multiplier); 
    ctx.fillStyle = '#84F058';
    ctx.fillText('Flappy Bird', width/2, 100*multiplier);
    ctx.fillStyle = 'black';
    ctx.fillText('press space to play', width/2+5*multiplier, 305*multiplier); 
    ctx.fillStyle = 'white';
    ctx.fillText('press space to play', width/2, 300*multiplier);
}

function animate(){                                                                     //główna funkcja zapentlana przez requestAnimationFrame
    const time = new Date().getTime();                                                  //dla optymalizacji sprawdzam czy minęło wystarczająco czasu 
    ctx.clearRect(0,0, width, height);                                                  //żeby gra działała tak samo na różnym sprzęcie, bo mogłaby zbyt szybko
    if(bird.alive || bird.position.y<height){
        pole1.update();
        if(pole2!=null){
            pole2.update();
        }
        bird.collide(pole1);
        if(pole2!=null){
            bird.collide(pole2);
        }
        bird.update();
    }
    else{
        pole1.update();
        if(pole2!=null){
            pole2.update();
        }
        bird.dead();
    }
    let delta = new Date().getTime();                                                   //pętla sprawdzająca czy minęło 15ms
    while(delta-time<=15) delta = new Date().getTime();
    if(game){
        requestAnimationFrame(animate);
    }
    
}

function set_game(){                                                                    //funkcja rozpoczynająca grę tworząca ptaka i pierwszy słupek
    bird = new Bird();
    pole1 = new Pole();
    pole2 = null;
}

let image = new Image();                                                                //stworzenie obiektu image i dodanie mu ścieżki, to png ptaka
image.src = "bird.png";
set_game();
start();
view_logo();
bird.draw();
pole1.draw();
addEventListener('keydown', (e)=>{                                                      //jak spacja jest wciśnięta to gdy animacja się nie zaczęła
    if(e.code=="Space")                                                                 //zaczyna animacje
    {
        if(animation==false){
            animation = true;
            requestAnimationFrame(animate);
        }
        if(bird.alive==true) bird.velocity = -17*multiplier;                            //jeśli ptak jest żywy zmienia jego prędkość 
        if(bird.alive == false && game == false) {                                      //jeśli ptak jest martwy i gra się zakończyła to wciśnięcie spacji
            location.reload(true);                                                      //reloaduje stronę
        }
    }
})