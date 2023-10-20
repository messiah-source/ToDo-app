(function () {
    let listArray = [],
        listName = '';

    // Создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // Создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append'); // класс помогает спозиционировать элемент справа
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        form.append(input);
        form.append(buttonWrapper);
        buttonWrapper.append(button);

        input.addEventListener('input', function () {
            if (input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        // Возвращаем объект чтобы из каждого элемента (form, input, button) у нас 
        // был доступ к данным друг друга
        return {
            form,
            input,
            button,
        };
    }

    // Создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // Создаем и возвращаем дело
    function createTodoItem(obj) {
        let item = document.createElement('li');
        // Кнопки помещаем в элемент, который крсиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Устанавливаем стили для элемента списка, а также для
        // размещения кнопок в его правой части с помощью флекс
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done == true) {
            item.classList.add('list-group-item-success');
        }

        // Добавляем обработчик на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            for (const listItem of listArray) {
                if (listItem.id == obj.id) {
                    listItem.done = !listItem.done;
                }
            }
            saveList(listArray, listName);
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {       // встроенная функция confirm в браузер
                item.remove();
                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) {
                        listArray.splice(i, 1);
                    }
                }
            }
            saveList(listArray, listName);
        });

        // Вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        
        // Приложению нужен доступ к самому элементу и кнопкам, 
        // чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };

    }

    // Находим максимальне число для уникальности и возвращаем +1
    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id;
            }
        }
        return max + 1;
    }

    // Функция записи данных
    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        // Делаем аргумент функции глобальным
        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // Получаем данные из строки, проверяем если есть данные, то парсим в массив и 
        // циклом добавляем наши данные на страницу
        let localData = localStorage.getItem(listName);

        if (localData !== null && localData !== '') {
            listArray = JSON.parse(localData);
        }

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        // Браузер создает событие submit на форме по нажатию на Enter или кнопку
        todoItemForm.form.addEventListener('submit', function (e) {
            // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            //Игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false,
            }

            // Создаем новое дело, пушим его в массив и сохраняем данные
            let todoItem = createTodoItem(newItem);
            
            listArray.push(newItem);
            saveList(listArray, listName);

            // Создаем и добавляем в список новое дело с названием из поля для ввода
            // todoList.append(createTodoItem(todoItemForm.input.value).item);
            todoList.append(todoItem.item);

            todoItemForm.button.disabled = true;

            // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        });
    }
    // Добавляем в глобальный объект функцию создания приложения чтобы
    // получать доступ из разных js файлов к этой функции
    window.createTodoApp = createTodoApp;
})();