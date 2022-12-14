window.addEventListener('DOMContentLoaded', async(event) => {
    console.log('DOMContentLoaded!!');
    await window.myApi.loadDb(`src/db/mylog.db`)
    const db = new MyLogDb()
    Loading.setup()
    let setting = await Setting.load()
    console.log(setting)
    const maker = new SiteMaker(setting)
    if (setting?.mona?.address) { document.getElementById('address').value = setting.mona.address }
    if (setting?.github?.username) { document.getElementById('github-username').value =  setting?.github?.username }
    if (setting?.github?.email) { document.getElementById('github-email').value =  setting?.github?.email }
    if (setting?.github?.token) { document.getElementById('github-token').value = setting?.github?.token }
    if (setting?.github?.repo?.name) { document.getElementById('github-repo-name').value = setting?.github?.repo?.name }
    document.querySelector('#versions-table').innerHTML = await VersionsToHtml.toHtml()
    // https://www.electronjs.org/ja/docs/latest/api/window-open
    document.querySelector('#open-repo').addEventListener('click', async()=>{
        window.open(`https://github.com/${document.getElementById('github-username').value}/${document.getElementById('github-repo-name').value}`, `_blank`)
    })
    document.querySelector('#open-site').addEventListener('click', async()=>{
        window.open(setting.github.repo.homepage, `_blank`)
    })
    const git = new Git(setting)
    const hub = new GitHub(setting)
    document.querySelector('#post').addEventListener('click', async()=>{
        try {
            await insert()
            await push()
        } catch (e) { Toaster.toast(e.message, true) }
    })
    document.querySelector('#delete').addEventListener('click', async()=>{
        try {
            const ids = Array.from(document.querySelectorAll(`#post-list input[type=checkbox][name=delete]:checked`)).map(d=>parseInt(d.value))
            console.debug(ids)
            const isDel = await db.delete(ids)
            if (!isDel) { return false }
            document.getElementById('post-list').innerHTML = await db.toHtml()
            const uiSetting = await getUiSetting()
            console.log(uiSetting)
            await update(`??????????????????:${new Date().toISOString()}`, uiSetting)
        } catch (e) { Toaster.toast(e.message, true) }
    })
    document.querySelector('#content').addEventListener('input', async(e)=>{
        const length = db.LENGTH - e.target.value.length
        document.querySelector('#content-length').innerText = length
        const line = db.LINE - ((0 === e.target.value.length) ? 0 : document.querySelector('#content').value.split(/\r\n|\n/).length)
        document.querySelector('#content-line').innerText = line
        if (length < 0) { error('#content-length') }
        else if (length < db.LENGTH * 0.2) { warning('#content-length') }
        else { clear('#content-length') }
        if (line < 0) { error('#content-line') }
        else if (line < db.LINE * 0.2) { warning('#content-line') }
        else { clear('#content-line') }
    })
    function warning(query) { clear(query); document.querySelector(query).classList.add('warning') }
    function error(query) { clear(query); document.querySelector(query).classList.add('error') }
    function clear(query) { document.querySelector(query).classList.remove('warning', 'error');  }
    document.querySelector('#save-setting').addEventListener('click', async()=>{
        setting = await Setting.load()
        setting.mona.address = document.getElementById('address').value
        setting.github.username = document.getElementById('github-username').value
        setting.github.email = document.getElementById('github-email').value
        setting.github.token = document.getElementById('github-token').value
        setting.github.repo.name = document.getElementById('github-repo-name').value
        //setting.github.repo.description = document.getElementById('github-repo-description').value
        //setting.github.repo.homepage = document.getElementById('github-repo-homepage').value
        //setting.github.repo.topics = document.getElementById('github-repo-topics').value
        await Setting.save(setting)
        Toaster.toast(`?????????????????????????????????`); 
        console.log(setting)
    })
    document.getElementById('post-list').innerHTML = await db.toHtml(document.getElementById('address').value)
    document.getElementById('content').focus()
    document.getElementById('content-length').textContent = db.LENGTH
    document.querySelector('#content-line').innerText = db.LINE
    async function getUiSetting() {
        return await Setting.obj(
            document.querySelector('#address').value, 
            document.querySelector('#github-username').value,
            document.querySelector('#github-email').value,
            document.querySelector('#github-token').value,
            document.querySelector('#github-repo-name').value,
        )
    }
    function isSetting(setting, uiSetting) {// Object.is(setting, uiSetting)????????????????????????????????????????????????
        console.log('isSetting')
        console.log(setting)
        console.log(uiSetting)
        const a = JSON.stringify(Object.entries(setting).sort())
        const b = JSON.stringify(Object.entries(uiSetting).sort())
        console.log(a === b)
        console.log(b)
        console.log(b)
        return a === b;
    }
    async function overwriteSetting(uiSetting) {// ?????????????????????UI???????????????
        console.log(`overwriteSetting()`, setting, uiSetting)
        if (!isSetting(setting, uiSetting)) {
            await Setting.save(uiSetting)
            console.debug(`setting.json?????????????????????`, setting, uiSetting)
            Toaster.toast(`?????????????????????????????????`)
        } else { console.log(`??????????????????????????????????????????????????????????????????`, setting, uiSetting) }
    }
    async function insert() {
        const insHtml = await db.insert(document.getElementById('content').value)
        const insEl = new DOMParser().parseFromString(`${insHtml}`, "text/html");
        document.getElementById('post-list').prepend(insEl.body.children[1])
        document.getElementById('post-list').prepend(insEl.body.children[0])
        document.querySelector('#content').value = ''
        document.querySelector('#content').dispatchEvent(new Event('input'))
    }
    async function push() {
        const uiSetting = await getUiSetting()
        console.log(uiSetting)
        const exists = await git.init(uiSetting)
        if (!exists) { // .git???????????????
            console.log(`?????????????????????`)
            console.log(setting.github.username)
            console.log(setting.github.token)
            console.log(setting.github.repo)
            const res = await hub.createRepo({
                'name': document.getElementById('github-repo-name').value,
                'description': setting.github.repo.description,
                'homepage': setting.github.repo.homepage,
            }, uiSetting)
            console.log(res)
            await maker.make(uiSetting)
            await git.push('????????????', uiSetting)
            await git.push('???????????????push??????asset/????????????????????????????????????????????????????????????????????????????????????', uiSetting) 
            await overwriteSetting(uiSetting)
        }
        else { await update(`????????????:${new Date().toISOString()}`, uiSetting) }
    }
    async function update(message, uiSetting) {
        try {
            await window.myApi.cp(
                `src/db/mylog.db`,
                `dst/${setting.github.repo.name}/db/mylog.db`,
                {'recursive':true, 'preserveTimestamps':true})
            await git.push(message, uiSetting) 
            await overwriteSetting(uiSetting)
        } catch (e) { Toaster.toast(e.message, true) }
    }
})
