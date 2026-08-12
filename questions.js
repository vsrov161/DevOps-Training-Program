// База данных вопросов и ответов
window.questionsDB = {
    sections: {
        "1": {
            name: "Пользователи, группы, права доступа, sudo",
            questions: [
                {
                    id: 1,
                    question: "Какой командой посмотреть всех пользователей системы? А только тех, у кого есть shell?",
                    answer: "`getent passwd` или `cat /etc/passwd`\nТолько с shell: `getent passwd | grep -E '/bin/(bash|sh|zsh)$'`"
                },
                {
                    id: 2,
                    question: "Как узнать UID и GID текущего пользователя? Как узнать то же самое для пользователя `www-data`?",
                    answer: "`id`\n`id www-data`"
                },
                {
                    id: 3,
                    question: "Создай пользователя `devops` с домашней директорией, bash в качестве shell и комментарием «DevOps Engineer».",
                    answer: "`sudo adduser devops`\nили полностью неинтерактивно:\n`sudo useradd -m -s /bin/bash -c \"DevOps Engineer\" devops`\n`sudo passwd devops`"
                },
                {
                    id: 4,
                    question: "Создай пользователя `tempuser` без домашней директории и без возможности логина (shell `/usr/sbin/nologin`).",
                    answer: "`sudo useradd -s /usr/sbin/nologin tempuser`\n(без `-m`, чтобы не создавать домашнюю)"
                },
                {
                    id: 5,
                    question: "Что будет, если создать пользователя с уже существующим UID?",
                    answer: "Ошибка: `useradd: UID 'xxxx' already exists`"
                },
                {
                    id: 6,
                    question: "Как принудительно задать UID=1500 и GID=1500 при создании пользователя?",
                    answer: "`sudo useradd -u 1500 -g 1500 -m -s /bin/bash username`"
                },
                {
                    id: 7,
                    question: "Создай группу `developers` и группу `admins`.",
                    answer: "`sudo groupadd developers`\n`sudo groupadd admins`"
                },
                {
                    id: 8,
                    question: "Добавь пользователя `devops` в группы `developers` и `sudo` одновременно одной командой.",
                    answer: "`sudo usermod -aG developers,sudo devops`"
                },
                {
                    id: 9,
                    question: "Как посмотреть, в каких группах состоит пользователь `devops`? А какие пользователи входят в группу `developers`?",
                    answer: "`groups devops` или `id devops`\nЧлены группы: `getent group developers`"
                },
                {
                    id: 10,
                    question: "Удали пользователя `tempuser` вместе с его домашней директорией (если она появилась) и почтовым ящиком.",
                    answer: "`sudo deluser --remove-home tempuser`"
                },
                {
                    id: 11,
                    question: "Что произойдёт, если удалить группу, в которой ещё есть пользователи?",
                    answer: "Группа удалится, у пользователей primary group станет числовым GID (или «nogroup»)."
                },
                {
                    id: 12,
                    question: "Создай файл `/tmp/secret.txt` от имени root. Сделай так, чтобы пользователь `devops` мог его читать, но не мог изменять и удалять.",
                    answer: "`sudo chown root:root /tmp/secret.txt`\n`sudo chmod 644 /tmp/secret.txt`"
                },
                {
                    id: 13,
                    question: "Установи на директорию `/opt/app` права: владелец `devops`, группа `developers`, владелец может всё, группа — читать и выполнять, остальные — ничего.",
                    answer: "`sudo chown devops:developers /opt/app`\n`sudo chmod 750 /opt/app`"
                },
                {
                    id: 14,
                    question: "Что делает `umask`? Какой umask нужно поставить, чтобы новые файлы создавались с правами 640, а директории — 750?",
                    answer: "`umask` показывает маску (по умолчанию обычно 0022).\nНужный umask: `027` (файлы 640, директории 750)."
                },
                {
                    id: 15,
                    question: "Объясни разницу между `chmod 755` и `chmod u=rwx,g=rx,o=rx`.",
                    answer: "Результат одинаковый. Первая запись — восьмеричная, вторая — символьная."
                },
                {
                    id: 16,
                    question: "Что такое SUID, SGID и sticky bit? Приведи практический пример, когда каждый из них нужен.",
                    answer: "- **SUID** — процесс запускается с правами владельца файла (`passwd`, `sudo`).\n- **SGID** на файле — запускается с правами группы файла. На директории — новые файлы наследуют группу директории.\n- **Sticky bit** (`+t`) — удалять файлы может только владелец файла (используется в `/tmp`)."
                },
                {
                    id: 17,
                    question: "Найди все файлы в системе с установленным SUID-битом.",
                    answer: "`find / -perm -4000 -type f 2>/dev/null`"
                },
                {
                    id: 18,
                    question: "Создай директорию `/data/shared`. Сделай так, чтобы все новые файлы внутри неё автоматически принадлежали группе `developers` (SGID).",
                    answer: "`sudo mkdir -p /data/shared`\n`sudo chown :developers /data/shared`\n`sudo chmod 2775 /data/shared`"
                },
                {
                    id: 19,
                    question: "Что будет, если на директорию поставить sticky bit (`chmod +t`)? Где это уже используется в системе?",
                    answer: "Удалять файл может только его владелец (или root). Уже стоит на `/tmp` и `/var/tmp`."
                },
                {
                    id: 20,
                    question: "Пользователь `devops` должен иметь возможность выполнять `systemctl restart nginx` без пароля. Как это настроить через sudoers?",
                    answer: "`sudo visudo`\nДобавить:\n`devops ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx`"
                },
                {
                    id: 21,
                    question: "Как правильно редактировать sudoers? Что будет, если допустить синтаксическую ошибку?",
                    answer: "Только через `visudo`. При синтаксической ошибке sudo может полностью перестать работать."
                },
                {
                    id: 22,
                    question: "Проверь, какие права sudo есть у текущего пользователя.",
                    answer: "`sudo -l`"
                },
                {
                    id: 23,
                    question: "Создай файл с правами 777. Потом с помощью ACL дай пользователю `devops` только чтение, а группе `developers` — чтение и запись, при этом обычные права оставь 644.",
                    answer: "`sudo setfacl -m u:devops:r,g:developers:rw file`\n`sudo chmod 644 file`"
                },
                {
                    id: 24,
                    question: "Как посмотреть текущие ACL на файле/директории? Как их полностью убрать?",
                    answer: "Посмотреть: `getfacl file`\nУбрать все ACL: `sudo setfacl -b file`"
                },
                {
                    id: 25,
                    question: "Симуляция: создай структуру для команды из 5 человек. Нужны пользователи `alice`, `bob`, `charlie`, `dave`, `eve`. Группы: `frontend`, `backend`, `devops-team`. Alice и Bob — frontend, Charlie и Dave — backend, Eve — devops-team + sudo. Общая директория `/projects` с правильными правами и SGID.",
                    answer: "```bash\nsudo groupadd frontend\nsudo groupadd backend\nsudo groupadd devops-team\n\nsudo adduser alice\nsudo adduser bob\nsudo adduser charlie\nsudo adduser dave\nsudo adduser eve\n\nsudo usermod -aG frontend alice\nsudo usermod -aG frontend bob\nsudo usermod -aG backend charlie\nsudo usermod -aG backend dave\nsudo usermod -aG devops-team,sudo eve\n\nsudo mkdir /projects\nsudo chown root:developers /projects\nsudo chmod 2775 /projects\n```"
                }
            ]
        },
        "2": {
            name: "Файловая система, диски, разделы, монтирование, LVM",
            questions: [
                {
                    id: 26,
                    question: "Какой командой посмотреть все блочные устройства и их разделы?",
                    answer: "`lsblk -f`\n`sudo fdisk -l`\n`sudo parted -l`"
                },
                {
                    id: 27,
                    question: "Как узнать, какая файловая система на `/` и сколько на ней свободно?",
                    answer: "`df -hT /`\n`findmnt /`"
                },
                {
                    id: 28,
                    question: "Создай loop-устройство из файла на 2 ГБ и сделай на нём раздел.",
                    answer: "```bash\ndd if=/dev/zero of=~/disk.img bs=1M count=2048\nsudo losetup -fP ~/disk.img\nsudo fdisk /dev/loop0\n```"
                },
                {
                    id: 29,
                    question: "Отформатируй этот раздел в ext4 с меткой `DATA`.",
                    answer: "`sudo mkfs.ext4 -L DATA /dev/loop0p1`"
                },
                {
                    id: 30,
                    question: "Примонтируй его в `/mnt/data` и сделай так, чтобы он монтировался автоматически при загрузке.",
                    answer: "```bash\nsudo mkdir /mnt/data\nsudo mount /dev/loop0p1 /mnt/data\nsudo blkid /dev/loop0p1\n# в /etc/fstab:\nUUID=xxxx-xxxx  /mnt/data  ext4  defaults  0  2\n```"
                },
                {
                    id: 31,
                    question: "Что будет, если в `/etc/fstab` указать неверный UUID?",
                    answer: "При загрузке система уйдёт в emergency mode или раздел просто не примонтируется (зависит от флагов)."
                },
                {
                    id: 32,
                    question: "Как правильно найти UUID раздела? А PARTUUID?",
                    answer: "`sudo blkid`\n`lsblk -o NAME,UUID,PARTUUID,FSTYPE,LABEL`"
                },
                {
                    id: 33,
                    question: "Создай swap-файл на 2 ГБ, активируй его и добавь в fstab.",
                    answer: "```bash\nsudo fallocate -l 2G /swapfile\nsudo chmod 600 /swapfile\nsudo mkswap /swapfile\nsudo swapon /swapfile\n# в fstab:\n/swapfile  none  swap  sw  0  0\n```"
                },
                {
                    id: 34,
                    question: "В чём разница между `mount -a` и простой перезагрузкой при ошибке в fstab?",
                    answer: "`mount -a` проверяет fstab без перезагрузки. При ошибке в fstab система может не загрузиться нормально."
                },
                {
                    id: 35,
                    question: "Покажи все смонтированные файловые системы в «человеческом» виде.",
                    answer: "`findmnt`\n`df -h`"
                },
                {
                    id: 36,
                    question: "Что делает `df -hT` и `du -sh *`? Когда какой использовать?",
                    answer: "`df` — смотрит по файловым системам.\n`du` — считает реальное использование внутри директорий."
                },
                {
                    id: 37,
                    question: "Найди самые большие директории в `/var`.",
                    answer: "`sudo du -h --max-depth=1 /var 2>/dev/null | sort -hr | head -20`"
                },
                {
                    id: 38,
                    question: "Создай LVM: physical volume → volume group `vg_data` → logical volume `lv_app` на 1 ГБ.",
                    answer: "```bash\nsudo pvcreate /dev/sdb\nsudo vgcreate vg_data /dev/sdb\nsudo lvcreate -L 1G -n lv_app vg_data\n```"
                },
                {
                    id: 39,
                    question: "Отформатируй LV в xfs и примонтируй.",
                    answer: "```bash\nsudo mkfs.xfs /dev/vg_data/lv_app\nsudo mkdir /mnt/app\nsudo mount /dev/vg_data/lv_app /mnt/app\n```"
                },
                {
                    id: 40,
                    question: "Расширь logical volume на +500 МБ «на лету» (с xfs).",
                    answer: "```bash\nsudo lvextend -L +500M /dev/vg_data/lv_app\nsudo xfs_growfs /mnt/app\n```"
                },
                {
                    id: 41,
                    question: "Как уменьшить logical volume (осторожно!)?",
                    answer: "С xfs почти невозможно корректно уменьшить. С ext4: сначала `resize2fs`, потом `lvreduce`. На проде лучше не делать."
                },
                {
                    id: 42,
                    question: "Что такое thin provisioning в LVM и когда его используют?",
                    answer: "Позволяет выдавать логическим томам больше места, чем есть физически. Широко используется в облаках и контейнерных платформах."
                },
                {
                    id: 43,
                    question: "Создай snapshot logical volume и потом удали его.",
                    answer: "```bash\nsudo lvcreate -s -n snap -L 200M /dev/vg_data/lv_app\nsudo lvremove /dev/vg_data/snap\n```"
                },
                {
                    id: 45,
                    question: "Как посмотреть, какие процессы держат файл/директорию открытой (не даёт отмонтировать)?",
                    answer: "`sudo lsof +D /mnt/data`\n`sudo fuser -mv /mnt/data`"
                },
                {
                    id: 46,
                    question: "Что будет, если отмонтировать файловую систему, на которой кто-то находится (`cd` туда)?",
                    answer: "`umount: target is busy`. Решения: `umount -l` (lazy) или убить процессы."
                },
                {
                    id: 47,
                    question: "Как сделать bind-mount директории и зачем это нужно?",
                    answer: "`sudo mount --bind /source /target`\nНужно для chroot, контейнеров, docker volumes и т.д."
                }
            ]
        },
        "3": {
            name: "Процессы, ресурсы, приоритеты",
            questions: [
                {
                    id: 48,
                    question: "Как посмотреть все процессы в системе в древовидном виде?",
                    answer: "`pstree -p`\n`ps axjf`"
                },
                {
                    id: 49,
                    question: "Найди PID процесса, который слушает порт 22.",
                    answer: "`ss -tlnp | grep ':22'`\n`sudo lsof -i :22`"
                },
                {
                    id: 50,
                    question: "Как убить процесс по имени, а не по PID?",
                    answer: "`pkill -f processname`\n`killall processname`"
                },
                {
                    id: 51,
                    question: "В чём разница между `kill`, `kill -9`, `kill -15`, `pkill`, `killall`?",
                    answer: "- `kill PID` = `kill -15` (SIGTERM) — вежливое завершение\n- `kill -9` — SIGKILL (нельзя перехватить)\n- `pkill` / `killall` — по имени"
                },
                {
                    id: 52,
                    question: "Запусти процесс в фоне, переведи его в фон после запуска, верни на передний план.",
                    answer: "`command &` → `Ctrl+Z` → `bg` → `fg`"
                },
                {
                    id: 53,
                    question: "Что такое zombie-процесс и как его найти?",
                    answer: "Процесс-зомби (состояние Z). Искать: `ps aux | grep ' Z'`"
                },
                {
                    id: 54,
                    question: "Как изменить приоритет (nice) уже работающего процесса?",
                    answer: "`renice -n 10 -p PID`"
                },
                {
                    id: 55,
                    question: "Запусти команду с nice = 10. Что это значит?",
                    answer: "Процесс станет «вежливее» (ниже приоритет)."
                },
                {
                    id: 56,
                    question: "Покажи топ процессов по потреблению CPU и по памяти.",
                    answer: "`htop` (удобнее всего)\n`ps aux --sort=-%cpu | head`\n`ps aux --sort=-%mem | head`"
                },
                {
                    id: 57,
                    question: "Как ограничить процесс по CPU и памяти с помощью systemd-run или cgroups?",
                    answer: "`sudo systemd-run --scope -p MemoryMax=300M -p CPUQuota=30% command`"
                },
                {
                    id: 58,
                    question: "Найди все процессы пользователя `devops`.",
                    answer: "`ps -u devops`\n`pgrep -a -u devops`"
                },
                {
                    id: 59,
                    question: "Что показывает `ps aux` vs `ps -ef` vs `ps -ejH`?",
                    answer: "- `ps aux` — BSD-формат\n- `ps -ef` — System V\n- `ps -ejH` — иерархия + сессии + jobs"
                },
                {
                    id: 60,
                    question: "Как посмотреть открытые файлы конкретного процесса?",
                    answer: "`sudo lsof -p PID`"
                },
                {
                    id: 61,
                    question: "Симуляция: «приложение» жрёт 100% CPU. Найди его, понизь приоритет, если не поможет — аккуратно заверши.",
                    answer: "`top`/`htop` → `renice` → `kill -15` → если нет — `-9`"
                },
                {
                    id: 62,
                    question: "Что будет, если процесс получит сигнал SIGTERM? А SIGKILL?",
                    answer: "SIGTERM можно обработать (корректное завершение). SIGKILL — нельзя, процесс убивается ядром сразу."
                },
                {
                    id: 63,
                    question: "Как сделать так, чтобы процесс продолжал работать после закрытия терминала?",
                    answer: "`nohup command &`\n`disown`\nили лучше systemd-сервис / tmux / screen"
                },
                {
                    id: 64,
                    question: "Посмотри нагрузку на систему за последнюю 1/5/15 минут.",
                    answer: "`uptime`\n`cat /proc/loadavg`"
                },
                {
                    id: 65,
                    question: "Что означает load average 4.00 на машине с 2 ядрами?",
                    answer: "Система сильно перегружена (средняя очередь процессов = 4 при 2 ядрах)."
                }
            ]
        },
        "4": {
            name: "Systemd, сервисы, логи",
            questions: [
                {
                    id: 66,
                    question: "Как посмотреть статус сервиса `ssh`? А все failed-сервисы?",
                    answer: "`systemctl status ssh`\n`systemctl --failed`"
                },
                {
                    id: 67,
                    question: "Перезапусти сервис и посмотри его логи за последние 10 минут.",
                    answer: "`sudo systemctl restart ssh`\n`journalctl -u ssh --since \"10 min ago\"`"
                },
                {
                    id: 68,
                    question: "Создай простой systemd-сервис, который раз в минуту пишет «Hello from systemd» в файл.",
                    answer: "Пример unit-файла `/etc/systemd/system/hello.service`:\n```ini\n[Unit]\nDescription=Hello Service\n\n[Service]\nType=oneshot\nExecStart=/bin/bash -c 'echo Hello from systemd >> /tmp/hello.log'\n\n[Install]\nWantedBy=multi-user.target\n```"
                },
                {
                    id: 69,
                    question: "Как сделать сервис автоматически запускающимся при загрузке?",
                    answer: "`sudo systemctl enable hello.service`"
                },
                {
                    id: 70,
                    question: "В чём разница между `systemctl start`, `enable`, `disable`, `mask`?",
                    answer: "- `start` — запустить сейчас\n- `enable` — добавить в автозагрузку\n- `disable` — убрать из автозагрузки\n- `mask` — полностью запретить запуск (даже вручную)"
                },
                {
                    id: 72,
                    question: "Создай timer, который запускает твой сервис каждые 5 минут.",
                    answer: "Создаётся отдельный `hello.timer`:\n```ini\n[Unit]\nDescription=Run hello every 5 minutes\n\n[Timer]\nOnCalendar=*:0/5\nPersistent=true\n\n[Install]\nWantedBy=timers.target\n```"
                },
                {
                    id: 73,
                    question: "Как посмотреть все логи системы с приоритетом err и выше за сегодня?",
                    answer: "`journalctl -p err --since today`"
                },
                {
                    id: 74,
                    question: "Найди в journal все сообщения, связанные с `sshd` за последний час.",
                    answer: "`journalctl -u ssh --since \"1 hour ago\"`"
                },
                {
                    id: 75,
                    question: "Как ограничить размер journald и вакуумить старые логи?",
                    answer: "В `/etc/systemd/journald.conf`:\n`SystemMaxUse=500M`\nЗатем: `sudo systemctl restart systemd-journald`\nОчистка: `sudo journalctl --vacuum-size=300M`"
                },
                {
                    id: 76,
                    question: "Симуляция: сервис падает. Нужно понять почему (логи + статус + journal).",
                    answer: "`systemctl status` + `journalctl -xe` + `journalctl -u servicename -b`"
                },
                {
                    id: 77,
                    question: "Как перезагрузить конфигурацию systemd без перезагрузки машины?",
                    answer: "`sudo systemctl daemon-reload`"
                },
                {
                    id: 78,
                    question: "Что делает `systemctl daemon-reload`?",
                    answer: "Перечитывает все unit-файлы с диска."
                },
                {
                    id: 79,
                    question: "Как посмотреть зависимости конкретного сервиса?",
                    answer: "`systemctl list-dependencies ssh.service`"
                },
                {
                    id: 80,
                    question: "Сделай так, чтобы сервис стартовал только после того, как поднялась сеть.",
                    answer: "В секции `[Unit]`:\n```ini\nAfter=network-online.target\nWants=network-online.target\n```"
                }
            ]
        },
        "5": {
            name: "Сеть",
            questions: [
                {
                    id: 81,
                    question: "Покажи все IP-адреса машины и какой интерфейс какой.",
                    answer: "`ip -br a`\n`ip a`"
                },
                {
                    id: 82,
                    question: "Какой командой посмотреть маршруты?",
                    answer: "`ip route`\n`ip r`"
                },
                {
                    id: 83,
                    question: "Как посмотреть, какие порты слушаются и какими процессами?",
                    answer: "`ss -tulnp`"
                },
                {
                    id: 84,
                    question: "Проверь доступность `8.8.8.8` и `google.com` (и по ICMP, и по TCP 443).",
                    answer: "```bash\nping -c 4 8.8.8.8\nping -c 4 google.com\ncurl -I https://google.com\nnc -zv google.com 443\n```"
                },
                {
                    id: 85,
                    question: "Что делает `ss -tulnp`? Чем лучше `netstat`?",
                    answer: "`ss` — современная, быстрее и информативнее замена `netstat`."
                },
                {
                    id: 86,
                    question: "Настрой временный IP на интерфейсе.",
                    answer: "`sudo ip addr add 192.168.56.50/24 dev enp0s3` (имя интерфейса посмотри через `ip a`)"
                },
                {
                    id: 87,
                    question: "Как посмотреть текущие DNS-серверы? Где они реально прописаны в Ubuntu 24.04?",
                    answer: "`resolvectl status`\nРеально управляется через `systemd-resolved` и `/etc/systemd/resolved.conf` + netplan."
                },
                {
                    id: 88,
                    question: "Очисти кэш DNS (systemd-resolved).",
                    answer: "`resolvectl flush-caches`"
                },
                {
                    id: 89,
                    question: "С помощью `ufw` разреши SSH только с конкретной подсети и включи файрвол.",
                    answer: "```bash\nsudo ufw allow from 192.168.56.0/24 to any port 22\nsudo ufw enable\nsudo ufw status verbose\n```"
                },
                {
                    id: 90,
                    question: "Посмотри правила iptables/nftables.",
                    answer: "`sudo nft list ruleset`\n(в Ubuntu 24.04 по умолчанию nftables)"
                },
                {
                    id: 91,
                    question: "Симуляция: «сайт не открывается». Диагностика от `ping` → `traceroute` → `dig` → `curl -v` → `ss`.",
                    answer: "Классический troubleshooting path: ping → traceroute → dig → curl -v → ss"
                },
                {
                    id: 92,
                    question: "Как сделать port-forwarding через ssh?",
                    answer: "`ssh -L 8080:localhost:80 user@remote_server`"
                },
                {
                    id: 94,
                    question: "Покажи статистику по сетевым интерфейсам (пакеты, ошибки).",
                    answer: "`ip -s link`\n`cat /proc/net/dev`"
                },
                {
                    id: 96,
                    question: "Найди все машины в локальной сети (быстрый скан).",
                    answer: "`nmap -sn 192.168.56.0/24` (если nmap установлен)\nили `arp-scan --local`"
                }
            ]
        },
        "6": {
            name: "Текст, поиск, пайпы, регулярки",
            questions: [
                {
                    id: 97,
                    question: "Найди все файлы, изменённые за последние 24 часа в `/etc`.",
                    answer: "`find /etc -type f -mtime -1`"
                },
                {
                    id: 98,
                    question: "Найди все `.conf` файлы и выведи только те строки, где есть `Port`.",
                    answer: "`grep -r --include=\"*.conf\" \"Port\" /etc`"
                },
                {
                    id: 99,
                    question: "Посчитай количество уникальных IP в access.log (представь, что он есть).",
                    answer: "`awk '{print $1}' access.log | sort | uniq -c | sort -nr`"
                },
                {
                    id: 100,
                    question: "Замени во всех файлах директории слово `old` на `new` рекурсивно.",
                    answer: "`grep -rl 'old' /path | xargs sed -i 's/old/new/g'`"
                },
                {
                    id: 101,
                    question: "Вырежи из файла 3–7 колонки и отсортируй уникальные значения.",
                    answer: "`cut -d' ' -f3-7 file | sort | uniq`"
                },
                {
                    id: 102,
                    question: "Как работает `xargs`? Приведи пример удаления файлов из списка.",
                    answer: "`cat list.txt | xargs rm -f`\nили `find ... -print0 | xargs -0 rm -f`"
                },
                {
                    id: 103,
                    question: "Найди процессы и сразу убей все, что содержат `python`.",
                    answer: "`pkill -f python`\nили `ps aux | grep python | awk '{print $2}' | xargs kill`"
                },
                {
                    id: 104,
                    question: "Симуляция: нужно из большого лога достать все ERROR за сегодня и сохранить в файл + посчитать количество.",
                    answer: "```bash\ngrep \"ERROR\" /var/log/syslog | grep \"$(date +%Y-%m-%d)\" > errors_today.txt\nwc -l errors_today.txt\n```"
                }
            ]
        },
        "7": {
            name: "Комплексные симуляции рабочих задач",
            questions: [
                {
                    id: 105,
                    question: "Подними «боевую» структуру:\n- Пользователи и группы под команду\n- Директории `/opt/apps`, `/data/logs`, `/data/backups` с правильными правами и SGID\n- Отдельный LV под логи\n- Systemd-сервис «приложения», которое пишет логи\n- Logrotate для этих логов\n- Cron/systemd-timer для бэкапа",
                    answer: "Пример базовой структуры:\n```bash\n# группы и пользователи (см. упр. 25)\nsudo mkdir -p /opt/apps /data/logs /data/backups\nsudo chown -R root:developers /opt/apps /data/logs /data/backups\nsudo chmod 2775 /opt/apps /data/logs /data/backups\n\n# LV под логи (пример)\nsudo lvcreate -L 2G -n lv_logs vg_data\nsudo mkfs.xfs /dev/vg_data/lv_logs\n# прописать в fstab и примонтировать в /data/logs\n```"
                },
                {
                    id: 108,
                    question: "Напиши bash-скрипт, который:\n- Создаёт пользователя\n- Добавляет в группы\n- Создаёт домашние директории с правильными правами\n- Генерирует SSH-ключ\n- Добавляет публичный ключ в authorized_keys",
                    answer: "```bash\n#!/bin/bash\nUSER=$1\nsudo adduser --disabled-password --gecos \"\" $USER\nsudo usermod -aG developers $USER\nsudo mkdir -p /home/$USER/.ssh\nsudo ssh-keygen -t ed25519 -f /home/$USER/.ssh/id_ed25519 -N \"\" -C \"$USER@devops\"\nsudo cat /home/$USER/.ssh/id_ed25519.pub | sudo tee -a /home/$USER/.ssh/authorized_keys\nsudo chown -R $USER:$USER /home/$USER/.ssh\nsudo chmod 700 /home/$USER/.ssh\nsudo chmod 600 /home/$USER/.ssh/authorized_keys\n```"
                },
                {
                    id: 109,
                    question: "Полный troubleshooting-сценарий «сервер тормозит»:\n- load average\n- iowait\n- кто жрёт диск (`iotop`, `iotop -o`)\n- кто жрёт память\n- какие процессы в D-state",
                    answer: "```bash\nuptime\ntop\nhtop\niostat -xz 1          # если установлен sysstat\niotop -o\nps aux --sort=-%mem | head\nps aux | awk '$8 ~ /D/ {print}'     # процессы в D-state\n```"
                }
            ]
        }
    }
};

// Проверка загрузки
console.log('База данных вопросов загружена. Всего разделов:', Object.keys(window.questionsDB.sections).length);