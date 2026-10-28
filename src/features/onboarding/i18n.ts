import { createTranslation } from '@/lib/i18n/create-translation';

type Task = [title: string, stage: 0 | 1 | 2, dueInDays: number, priority: 0 | 1 | 2];
type Book = [title: string, author: string, stage: 0 | 1 | 2, rating: number | null];

const en = {
  welcome: {
    title: 'Welcome to nOOk',
    intro:
      'nOOk is a workspace for notes, task lists and project boards. Everything lives in your browser — nothing is sent anywhere.',
    tryTitle: 'Try these',
    tries: [
      ["Type '/' on an empty line to insert a heading, list, to-do or code block", false],
      ['Select some text to make it bold, italic or a link', false],
      ['Press ⌘K (Ctrl K) to search everything and run commands', false],
      ['Open “Website relaunch” and drag a card to Done', false],
      ['Check off a task on the Today screen', false],
    ] as [string, boolean][],
    howTitle: 'How it is organised',
    how: [
      'Pages nest like folders — drag them in the sidebar',
      'Databases hold records with columns; view them as a table or a board',
      'Every record is a page too: open it to write notes under its properties',
      'Today collects every dated task from all databases',
    ],
    outro:
      'Everything here is sample content. Edit it, or move it all to the trash and start fresh.',
  },
  notes: {
    title: 'Kick-off notes',
    body: [
      'Goal: relaunch the website before the end of the month.',
      'Owners: design — Ola, copy — Tom, build — you.',
    ],
    next: 'Next steps',
    steps: [
      ['Agree on the page list', true],
      ['Write the homepage copy', false],
      ['Book a review on Friday', false],
    ] as [string, boolean][],
  },
  relaunch: {
    title: 'Website relaunch',
    priority: 'Priority',
    priorities: ['High', 'Medium', 'Low'],
    tasks: [
      ['Fix the broken signup form', 1, -2, 0],
      ['Write the homepage copy', 1, 0, 0],
      ['Review the new logo', 0, 0, 1],
      ['Set up analytics', 0, 1, 1],
      ['Design the pricing page', 0, 3, 0],
      ['Prepare the launch email', 0, 5, 2],
      ['Plan social posts', 0, 9, 2],
      ['Pick the font pairing', 2, -4, 1],
      ['Migrate old blog posts', 2, -1, 2],
    ] as Task[],
    taskNote: 'The form throws an error after the second step. Check the email validation first.',
  },
  reading: {
    title: 'Reading list',
    stages: ['Want to read', 'Reading', 'Finished'],
    finishedOn: 'Finished on',
    author: 'Author',
    rating: 'Rating',
    books: [
      ['Refactoring UI', 'Adam Wathan, Steve Schoger', 2, 5],
      ['The Design of Everyday Things', 'Don Norman', 1, null],
      ['Shape Up', 'Ryan Singer', 0, null],
      ['Designing Data-Intensive Applications', 'Martin Kleppmann', 0, null],
    ] as Book[],
  },
  status: 'Status',
  stages: ['To do', 'In progress', 'Done'],
  date: 'Due',
};

const pl: typeof en = {
  welcome: {
    title: 'Witaj w nOOk',
    intro:
      'nOOk to przestrzeń na notatki, listy zadań i tablice projektów. Wszystko zostaje w Twojej przeglądarce — nic nie jest nigdzie wysyłane.',
    tryTitle: 'Spróbuj',
    tries: [
      ["Wpisz '/' w pustej linii, żeby wstawić nagłówek, listę, to-do albo kod", false],
      ['Zaznacz tekst, żeby go pogrubić, pochylić albo dodać link', false],
      ['Wciśnij ⌘K (Ctrl K), żeby przeszukać wszystko i uruchamiać polecenia', false],
      ['Otwórz „Nowa strona www” i przeciągnij kartę do Zrobione', false],
      ['Odhacz zadanie na ekranie Dziś', false],
    ],
    howTitle: 'Jak to jest poukładane',
    how: [
      'Strony zagnieżdżają się jak foldery — przeciągaj je w sidebarze',
      'Bazy danych trzymają rekordy z kolumnami; oglądasz je jako tabelę albo tablicę',
      'Każdy rekord to też strona: otwórz go, żeby pisać notatki pod jego polami',
      'Dziś zbiera zadania z terminem ze wszystkich baz',
    ],
    outro:
      'Wszystko tutaj to przykładowa treść. Edytuj ją albo przenieś do kosza i zacznij od zera.',
  },
  notes: {
    title: 'Notatki z kick-offu',
    body: [
      'Cel: nowa strona www przed końcem miesiąca.',
      'Odpowiedzialni: design — Ola, teksty — Tomek, wdrożenie — Ty.',
    ],
    next: 'Kolejne kroki',
    steps: [
      ['Ustalić listę podstron', true],
      ['Napisać tekst strony głównej', false],
      ['Umówić przegląd na piątek', false],
    ],
  },
  relaunch: {
    title: 'Nowa strona www',
    priority: 'Priorytet',
    priorities: ['Wysoki', 'Średni', 'Niski'],
    tasks: [
      ['Naprawić formularz rejestracji', 1, -2, 0],
      ['Napisać tekst strony głównej', 1, 0, 0],
      ['Przejrzeć nowe logo', 0, 0, 1],
      ['Podpiąć analitykę', 0, 1, 1],
      ['Zaprojektować stronę z cennikiem', 0, 3, 0],
      ['Przygotować maila na start', 0, 5, 2],
      ['Zaplanować posty w social media', 0, 9, 2],
      ['Wybrać parę fontów', 2, -4, 1],
      ['Przenieść stare wpisy bloga', 2, -1, 2],
    ],
    taskNote: 'Formularz wyrzuca błąd po drugim kroku. Najpierw sprawdzić walidację maila.',
  },
  reading: {
    title: 'Do przeczytania',
    stages: ['Chcę przeczytać', 'Czytam', 'Przeczytane'],
    finishedOn: 'Przeczytane dnia',
    author: 'Autor',
    rating: 'Ocena',
    books: [
      ['Refactoring UI', 'Adam Wathan, Steve Schoger', 2, 5],
      ['Dizajn na co dzień', 'Don Norman', 1, null],
      ['Shape Up', 'Ryan Singer', 0, null],
      ['Przetwarzanie danych w dużych systemach', 'Martin Kleppmann', 0, null],
    ],
  },
  status: 'Status',
  stages: ['Do zrobienia', 'W trakcie', 'Zrobione'],
  date: 'Termin',
};

export const useOnboardingTranslation = createTranslation({ en, pl });
export type SampleCopy = typeof en;
