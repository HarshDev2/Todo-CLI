#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import inquirer from 'inquirer'

let command = process.argv[2];
if(command === 'add'){
    const questions = await inquirer.prompt([
        {
            message: 'What should be the todo title?',
            type: 'input',
            name: 'title'
        },
    ]);
    
    if(!existsSync('todos.json')){
        await writeFile('todos.json', JSON.stringify([{title: questions.title}]));
    }
    else{
        const file = await readFile('todos.json', 'utf-8');
        const data = await JSON.parse(file);

        await data.push({title: questions.title});

        await writeFile('todos.json', JSON.stringify(data));
    }
    console.log(`A todo named "${questions.title}" has been sucessfully created!`);
}
if(command === 'list'){
    if(!existsSync('todos.json')){
        console.log('Cannot find todos file!')
    }
    else {
        const file = await readFile('todos.json', 'utf-8');
        const data = await JSON.parse(file);
        
        let todosString = data.map((todo: any, index: number) => `${index + 1}) ${todo.title}`).join('\n');
        console.log(`Todos: \n ${todosString}`);
    }
}
if(command === 'complete'){
    if(!existsSync('todos.json')){
        console.log('Cannot find any todos!')
    }
    else {
        const file = await readFile('todos.json', 'utf-8');
        const data = await JSON.parse(file);

        let options = data.map((todo: any) => todo.title);

        const response = await inquirer.prompt([
            {
                name: 'chooses',
                message: 'Choose the todos!',
                type: 'checkbox',
                choices: options
            }
        ]);

        const selectedTodos = response.chooses;
        let newData = data.filter((todo: any) => !selectedTodos.includes(todo.title));

        await writeFile('todos.json', JSON.stringify(newData));
        console.log('Todos are sucessfully updated!');
    }
}