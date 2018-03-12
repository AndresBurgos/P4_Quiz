const model = require('./model');

const {log, biglog, errorlog, colorize} = require('./out');

const process = require('process');


exports.helpCmd = rl => {
    log("Comandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta en el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|player - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Creditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};


exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
});
    rl.prompt();
};



exports.showCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog("Falta el parametro id. ");
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`   [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize("=>", 'magenta')} ${quiz.answer}`);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ','red'), question => {

        rl.question(colorize(' Introduzca la respuesta: ','red'), answer=> {

        model.add(question, answer);
    log(`  ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
    rl.prompt();
});
});
};


exports.deleteCmd = (rl, id) => {

    if (typeof id === "undefined"){
        errorlog('Falta el parametro id.');
    } else {
        try {
            model.deleteByIndex(id);
        } catch (error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};


exports.editCmd = (rl, id) => {

    if( typeof id === "undefined"){
        errorlog('Falta el parametro id.');
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            rl.question(colorize(' Introduzca una pregunta: ','red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
            rl.question(colorize(' Introduzca la respuesta: ','red'),answer=>{
                model.update(id, question, answer);
            log(` Se ha cambiado el quiz  ${colorize(id, 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        });
        });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};



exports.testCmd = (rl, id) => {

    if (typeof id === "undefined"){
        errorlog('Falta el parametro id.');
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(`${quiz.question}?: `,'magenta'),  resp => {
                resp = resp.toLowerCase().trim();

            if(resp===quiz.answer.toLowerCase().trim()) {
                log('La respuesta es correcta.');
                biglog('CORRECTO', 'green');
            }
            else{
                    log('La respuesta es incorrecta.');
                    biglog('INCORRECTO','red');
            }
            rl.prompt();
        });
        } catch(error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
    rl.prompt();
};


exports.playCmd = rl => {

    let score = 0;
    let toBeResolved = [];


    for(let i = 0; i < model.count(); i++)
        toBeResolved[i] = i;

    const playOne = () => {

        if (toBeResolved.length === 0){
            log('Ya se han hecho todas las preguntas!','green');
            log(`Has ganado. Numero de aciertos: ${score}`);
            rl.prompt();
        } else {
            let id = Math.floor(Math.random() * toBeResolved.length);
            let quiz = model.getByIndex(toBeResolved[id]);
            toBeResolved.splice(id, 1);

            rl.question(colorize(`${quiz.question}?: `,'magenta'), resp => {
                resp = resp.toLowerCase().trim();
                if(resp===quiz.answer.toLowerCase().trim()) {
                    score= score+1;
                    log(`CORRECTO - ${score} aciertos.`, 'green');
                    playOne();
                }
                else{
                    log(`INCORRECTO.`, 'red');
                    log(`Fin del juego. Aciertos: ${score}`);
            }
            rl.prompt();}
        );
        }
    };
    playOne();
    rl.prompt();
};


exports.creditsCmd = rl => {
    log('Autores de la practica:');
    log('Andres Burgos Sanchez', 'blue');
    log('Juan Crespi de Valldaura', 'blue');
    rl.prompt();
};



exports.quitCmd = rl => {
    rl.close();
};