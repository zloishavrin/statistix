export const resources = {
	ru: {
		common: {
			today: "Сегодня",
			yesterday: "Вчера",
			buttons: {
				return: "Назад",
			},
		},
		header: {
			home: "Главная",
			history: "История",
			profile: "Настройки",
		},
		home: {
			title: "STATISTIX",
			subtitle: "Это просто",
			buttons: {
				start: "Начать",
			},
		},
		login: {
			login: {
				title: "Вход",
				inputs: {
					login: {
						label: "Логин",
					},
					password: {
						label: "Пароль",
					},
				},
				buttons: {
					enter: {
						label: "Войти",
					},
					registration: {
						label: "Зарегистрироваться",
					},
					forgot: {
						label: "Забыл пароль",
					},
				},
				error: "Неверный логин или пароль",
			},
			registration: {
				title: "Регистрация",
				inputs: {
					login: {
						label: "Логин",
					},
					password: {
						label: "Пароль",
					},
					passwordConfirm: {
						label: "Пароль еще раз",
					},
				},
				buttons: {
					enter: {
						label: "Создать аккаунт",
					},
					login: {
						label: "У меня уже есть аккаунт",
					},
				},
				error: "Некорректные логин или пароль",
			},
		},
		notfound: {
			title: "404",
			subtitle: "Страница не найдена",
			buttons: {
				home: "На главную",
			},
		},
		profile: {
			sidebar: {
				profile: "Профиль",
				language: "Язык",
				changePassword: "Смена пароля",
				logout: "Выход",
			},
			profileForm: {
				title: "Профиль",
				inputs: {
					login: {
						label: "Логин",
					},
				},
			},
			changePasswordForm: {
				title: "Смена пароля",
				inputs: {
					currentPassword: {
						label: "Текущий пароль",
					},
					password: {
						label: "Новый пароль",
					},
					retryPassword: {
						label: "Новый пароль еще раз",
					},
				},
				buttons: {
					submit: {
						label: "Сменить пароль",
					},
				},
				error: "Не удалось изменить пароль",
				success: "Пароль успешно изменен",
			},
			languageForm: {
				title: "Язык",
			},
			logoutForm: {
				buttons: {
					submit: {
						label: "Выйти из аккаунта",
					},
				},
			},
		},
		main: {
			search: {
				placeholder: "Поиск",
			},
		},
		tableManager: {
			button: {
				add: "Добавить таблицу",
				label:
					"Для расчетов необходимо добавить таблицу со следующими данными:",
				remove: "Убрать таблицу",
			},
		},
		fileManager: {
			upload: {
				button: "Загрузить таблицу",
				label: "Поддерживаются XLSX/XLS/CSV файлы",
				errorMessage: "Ошибка загрузки",
			},
			list: {
				title: "Последние загруженные таблицы",
				emptyMessage: "Отсутствуют загруженные таблицы",
				errorMessage: "Ошибка загрузки",
				buttonMore: "Больше",
			},
		},
		tablePreview: {
			title: "Выберите ряд данных",
			tableTitle: "Ряды данных",
			confirm: "Подтвердить",
		},
		history: {
			task_statuses: {
				title: "Статус",
				all: "Все",
				inQueue: "Ожидает",
				inProgress: "Вычисление",
				completed: "Завершено",
				failed: "Ошибка",
			},
			header: {
				name: "Задача",
				createdAt: "Дата создания",
				completedAt: "Дата завершения",
			},
		},
		method: {
			start: "Запустить",
			errors: {
				methodNotLoading: "Метод еще не загружен.",
				tableNotSelected: "Укажите таблицу.",
				seriesNotSelected: "Укажите следующие данные:",
				paramsNotSelected: "Укажите следующие параметры:",
			},
		},
		task: {
			results: "Результаты",
		},
		dataPreview: {
			title: "Визуализация данных",
			selectors: {
				visualization: {
					title: "Тип визуализации",
					table: "Таблица",
					linear: "Линейный график",
					area: "Диаграмма с областями",
					bar: "Столбчатая диаграмма",
					scatter: "Точечная диаграмма",
				},
			},
			download: "Скачать",
		},
		chartPreview: {
			selectors: {
				on: "Вкл",
				off: "Выкл",
				axisX: "Ось X",
				axisY: "Ось Y",
				legend: "Легенда",
				grid: "Сетка",
				dots: "Точки",
				typeChart: {
					title: "Тип графика",
					basis: "Базисный",
					monotone: "Монотонный",
					bump: "С изгибами",
					linear: "Линейный",
					natural: "Сглаженный",
					step: "Ступенчатый",
				},
			},
		},
		notification: {
			success: "Задача успешно завершена.",
			failed: "Ошибка при выполнении задачи.",
		},
	},
	en: {
		common: {
			today: "Today",
			yesterday: "Yesterday",
			buttons: {
				return: "Go back",
			},
		},
		header: {
			home: "Home",
			history: "History",
			profile: "Settings",
		},
		home: {
			title: "STATISTIX",
			subtitle: "It's just easy",
			buttons: {
				start: "Start",
			},
		},
		login: {
			login: {
				title: "Login",
				inputs: {
					login: {
						label: "Username",
					},
					password: {
						label: "Password",
					},
				},
				buttons: {
					enter: {
						label: "Log In",
					},
					registration: {
						label: "Register",
					},
					forgot: {
						label: "Forgot Password",
					},
				},
				error: "Incorrect login or password",
			},
			registration: {
				title: "Registration",
				inputs: {
					login: {
						label: "Username",
					},
					password: {
						label: "Password",
					},
					passwordConfirm: {
						label: "Repeat Password",
					},
				},
				buttons: {
					enter: {
						label: "Create Account",
					},
					login: {
						label: "I already have an account",
					},
				},
				error: "Incorrect login or password",
			},
		},
		notfound: {
			title: "404",
			subtitle: "Oops! This page doesn’t exist",
			buttons: {
				home: "Home",
			},
		},
		profile: {
			sidebar: {
				profile: "Profile",
				changePassword: "Change Password",
				language: "Language",
				logout: "Logout",
			},
			profileForm: {
				title: "Profile",
				inputs: {
					login: {
						label: "Login",
					},
				},
			},
			changePasswordForm: {
				title: "Change Password",
				inputs: {
					currentPassword: {
						label: "Current Password",
					},
					password: {
						label: "New Password",
					},
					retryPassword: {
						label: "Repeat New Password",
					},
				},
				buttons: {
					submit: {
						label: "Change Password",
					},
				},
				error: "Failed to change password",
				success: "Password changed successfully",
			},
			languageForm: {
				title: "Language",
			},
			logoutForm: {
				buttons: {
					submit: {
						label: "Log Out",
					},
				},
			},
		},
		main: {
			search: {
				placeholder: "Search",
			},
		},
		tableManager: {
			button: {
				add: "Add table",
				label: "You need to add a table with the following data:",
				remove: "Remove table",
			},
		},
		fileManager: {
			upload: {
				button: "Upload table",
				label: "XLSX/XLS/CSV files are supported",
				errorMessage: "Upload error",
			},
			list: {
				title: "Last uploaded tables",
				emptyMessage: "Uploaded tables are missing",
				errorMessage: "Download error",
				buttonMore: "More",
			},
		},
		tablePreview: {
			title: "Select a series of data",
			tableTitle: "Data series",
			confirm: "Confirm",
		},
		history: {
			task_statuses: {
				title: "Status",
				all: "All",
				inQueue: "Await",
				inProgress: "Сomputation",
				completed: "Completed",
				failed: "Failed",
			},
			header: {
				name: "Task",
				createdAt: "Creation date",
				completedAt: "Completion date",
			},
		},
		method: {
			start: "Start",
			errors: {
				methodNotLoading: "Method has not been loaded.",
				tableNotSelected: "Select table.",
				seriesNotSelected: "Specify data series:",
				paramsNotSelected: "Specify parameters:",
			},
		},
		task: {
			results: "Results",
		},
		dataPreview: {
			title: "Data visualization",
			selectors: {
				visualization: {
					title: "Visualization",
					table: "Table",
					linear: "Linear chart",
					area: "Area chart",
					bar: "Bar chart",
					scatter: "Scatter chart",
				},
			},
			download: "Download",
		},
		chartPreview: {
			selectors: {
				on: "On",
				off: "Off",
				axisX: "X-Axis",
				axisY: "Y-Axis",
				legend: "Legend",
				grid: "Grid",
				dots: "Dots",
				typeChart: {
					title: "Chart type",
					basis: "Basis",
					monotone: "Monotone",
					bump: "Bump",
					linear: "Linear",
					natural: "Natural",
					step: "Step",
				},
			},
		},
		notification: {
			success: "The task has been successfully completed.",
			failed: "Error when computing the task.",
		},
	},
} as const;
