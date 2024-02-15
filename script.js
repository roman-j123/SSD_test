// Заводим глобальные константы
const TASK_LIST = document.querySelector('.task-list');
const ADD_TASK_FORM = document.querySelector('.task-form');
const ADD_TASK_INPUT = document.querySelector('.task-form__input');
const NAVIGATION_ITEMS = document.querySelectorAll('.navigation__item')
let ID_COUNTER = 0;
let SORT_STATE = 'allTasks';
const TASK_LIST_DATA = [];

const TASK_DATA = {
  id: `Task_${ID_COUNTER}`,
  name: '',
  done: false,
}

// Инициализируем функцию приложения
function App() {
  // Вешаем обработчик событий на форму по событию submit
  ADD_TASK_FORM.addEventListener('submit', handleAddTask);
  // Проходим по всем элементам навигации
  NAVIGATION_ITEMS.forEach(item => {
    // На каждый элемент навигации вешаем обработчик по событию click
    item.addEventListener('click', (event) => {
      // При клике в глобальную переменную задаем значение для фильтрации
      SORT_STATE = event.target.id;
      // Предварительно удаляем селектор для активного элемента навигации
      for (const item of NAVIGATION_ITEMS) {
        item.classList.remove('navigation__item_active');
      }
      // Находим нужный элемент навигации значения фильтрации
      if (event.target.id === SORT_STATE) {
        event.target.classList.add('navigation__item_active');
        const result = filterTaskList(SORT_STATE);
        return renderTaskList(result);
      }
    })
  })
  // Функция фильтрации массива с задачами
  function filterTaskList(sortValue) {
    switch (sortValue) {
      case 'activeTasks':
        return TASK_LIST_DATA.filter(item => item.done === false);
      case 'doneTasks':
        return TASK_LIST_DATA.filter(item => item.done === true);
      default:
        return TASK_LIST_DATA;
    }
  }
  // Функция для нахождения индекса элемента
  function findElementIndex(el) {
    return TASK_LIST_DATA.findIndex(item => {
      return item.id === el;
    })
  }
  // Функция добавления задачи
  function handleAddTask(event) {
    // Отменяем стандартное поведение 
    event.preventDefault();
    // Задаем проверку на пустое значение поля
    if (event.target[0].value.trim() === '') {
      return alert('Вы забыли написать задачу')
    }
    ID_COUNTER += 1;
    // Создаем копию объекта
    const result = Object.assign({}, TASK_DATA);
    // Убираем пробелы
    result.name = event.target[0].value.trim();
    // Добавляем id
    result.id = `Task_${ID_COUNTER}`;
    // Вставляем в массив
    TASK_LIST_DATA.push(result);
    // Сбрасываем значения инпута
    event.target[0].value = '';
    // Возвращаем отрисованный список
    return renderTaskList(TASK_LIST_DATA);
  }
  // Функция выполнения задачи
  function handleCompleteTask(event) {
    // Достаем id нужного элемента
    const COMPLETE_EL = event.target.parentElement.id;
    // Находим его индекс
    const findTaskIndex = findElementIndex(COMPLETE_EL);
    // Меняем значению ключа 
    TASK_LIST_DATA[findTaskIndex].done = !TASK_LIST_DATA[findTaskIndex].done;
    // Возвращаем отрисованный список
    return renderTaskList(TASK_LIST_DATA);
  }
  // Функция удаления задачи
  function handleRemoveTask(event) {
    // Достаем id нужного элемента
    const REMOVE_EL = event.target.parentElement.id;
    // Находим его индекс
    const findTaskIndex = findElementIndex(REMOVE_EL);
    // Вырезаем из массива
    const result = TASK_LIST_DATA.splice(findTaskIndex, 1);
    // Возвращаем новый отрисованный список
    return renderTaskList(result);
  }
  // Функция для создания элемента в DOM
  function createTaskElement(data) {
    // Тут используем:
    // createElement - создаем элемент
    // classList.add - добавляем классы
    // append - вставляем в разметку
    // textContent - вставляем текст
    // addEventListener - вешаем обработчик по клику на нужные элементы DOM
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const removeBtn = document.createElement('button');
    const doneBtn = document.createElement('button');
    li.setAttribute('id', `${data.id}`);
    li.classList.add('task-list__item', 'item');
    h2.classList.add('item__name');
    removeBtn.classList.add('item__remove');
    doneBtn.classList.add('item__done');
    // Если задача выполнена - добавляем селектор
    if (data.done === true) {
      doneBtn.classList.add('item__done_complete');
    }
    TASK_LIST.append(li);
    h2.textContent = data.name;
    removeBtn.addEventListener('click', handleRemoveTask);
    doneBtn.addEventListener('click', handleCompleteTask);
    li.append(doneBtn);
    li.append(h2);
    li.append(removeBtn)
  }
  // Функция для рендера списка задач
  function renderTaskList(list) {
    // Сбрасываем DOM элементов списка
    TASK_LIST.innerHTML = '';
    // Фильтруем
    const render = filterTaskList(SORT_STATE);
    // Рендер списка после фильтра
    for (const item of render) {
      createTaskElement(item)
    }
    // Если массив пустой - выдаем сообщение
    if (render.length === 0) {
      TASK_LIST.innerHTML = '<li class="task-list__item item">Список пуст</li>'
    }
  }
  // Первый запуск функции для отрисовки списка
  renderTaskList(TASK_LIST_DATA);
}
// Первый запуск приложения
App();
