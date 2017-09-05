let module = (function(){
    let imgs = document.getElementsByClassName('content-main-image'),
        filter = document.getElementsByClassName('filterSize'),
        resultApi = document.getElementById('sidebar-filter-title'),
        spinner = document.getElementById('spinner')

    let initModule,loadImgs,nextTwentyImgs,prevTwentyImgs,getImgs,
        updateListImg,select,filterName,sortImgs,takeImg
    let initState = {
        select:'all',
        ResultFetch : [],
        ImagesArray : [],
        LargeImgs :[],
        MediumImgs :[],
        SmallImgs :[],
        step : 20
    }
    loadImgs = ()=>{
        spinner.classList.toggle('spin-visible')
        fetch('https://unsplash.it/list')
        .then(response=>response.json()
            .then(data=>{
                initState.ResultFetch = data
                initState.ImagesArray = initState.ResultFetch
                resultApi.innerHTML = `API выдал ${data.length} картинок`
                spinner.classList.toggle('spin-visible')
                return initState.ImagesArray;
            })
            .then(()=>{    
                for(let i=0;i<20;i++){
                    let span = document.createElement('span')
                    span.innerText  = 
                    `${initState.ImagesArray[i].width} x ${initState.ImagesArray[i].height}
                     ${initState.ImagesArray[i].author}`
                    imgs[i].appendChild(span)
                }  
                sortImgs()   
            })
        )
    }
    nextTwentyImgs = function(){
        let arrImgs = initState.ImagesArray
        if(arrImgs.length<20)return
        for(let i=0;i<20;i++){
            if(arrImgs[initState.step+i]==undefined){
                imgs[i].getElementsByTagName('span')[0].innerHTML=''
                continue;
             }
            imgs[i].getElementsByTagName('span')[0].innerHTML =  
            `${arrImgs[initState.step+i].width} x 
            ${arrImgs[initState.step+i].height} 
            ${arrImgs[initState.step+i].author}`
        }
        initState.step+=20;
    }
    prevTwentyImgs = function(){
        let arrImgs = initState.ImagesArray
        if(arrImgs.length<20)return
        if(initState.step!==20){
            initState.step-=40;
            for(let i=0;i<20;i++){
                imgs[i].getElementsByTagName('span')[0].innerHTML =  
                `${arrImgs[initState.step+i].width} x 
                ${arrImgs[initState.step+i].height} 
                ${arrImgs[initState.step+i].author}`
            }
            initState.step+=20
        }
    }    
    sortImgs = function(){
        initState.ResultFetch.map(item=>{
            item.height>1500&&
            item.width>1500&&
            initState.LargeImgs.push(item)   
            
            item.height>800&&item.height<1499&&
            item.width>800&&item.width<1499&&
            initState.MediumImgs.push(item)   
            
            item.height<799&&initState.SmallImgs.push(item)
        })
    }          
    getImgs = function(size,callback){
            switch(size){
                case 'large':
                initState.select='large'
                initState.ImagesArray=initState.LargeImgs
                resultApi.innerHTML = `Найдено ${initState.LargeImgs.length} картинок`
                callback(initState.LargeImgs)
                break
                case 'medium':
                initState.select='medium'
                initState.ImagesArray=initState.MediumImgs
                resultApi.innerHTML = `Найдено ${initState.MediumImgs.length} картинок`
                callback(initState.MediumImgs)
                break
                case 'small':
                initState.select='small'
                initState.ImagesArray=initState.SmallImgs
                resultApi.innerHTML = `Найдено ${initState.SmallImgs.length} картинок`
                callback(initState.SmallImgs)
                break
                default: 
                initState.select='all'
                initState.ImagesArray=initState.ResultFetch
                resultApi.innerHTML = `Всего ${initState.ResultFetch.length} картинок`
                callback(initState.ResultFetch)
            }  
            console.log(initState.select)
    }
    updateListImg = function(arrImgs){
        for(let i=0;i<20;i++){
            if(arrImgs[i]==undefined){
               imgs[i].getElementsByTagName('span')[0].innerHTML=''
               continue;
            }
            imgs[i].getElementsByTagName('span')[0].innerHTML = 
            `${arrImgs[i].width} x 
            ${arrImgs[i].height}
            ${arrImgs[i].author}`
        }
        initState.step = 20;
    }
    select = function(e,key){
        for(let key of filter) key.classList.remove('select')
        document.getElementById(e.currentTarget.id).classList.add('select')
    }
    takeImg = function(e,element){
        if(element.getElementsByTagName('span')[0].innerHTML=='')return
        element.classList.toggle('active')
    }
    filterName = function(e,callback){
        e.code='Backspace'?initState.ImagesArray=initState.ResultFetch:''
        let resultFilter = [],
            arrForFilter = []
        let inputFilterName = e.currentTarget
        //document.getElementById(inputFilterName.id).nextSibling.innerHTML = inputFilterName.value
        initState.select == 'all' && (arrForFilter=initState.ResultFetch)
        initState.select == 'large' && (arrForFilter=initState.LargeImgs)
        initState.select == 'medium' && (arrForFilter=initState.MediumImgs)
        initState.select == 'small' && (arrForFilter=initState.SmallImgs)

        arrForFilter.forEach(function(element) {
            element.author.indexOf(inputFilterName.value)!=-1&&resultFilter.push(element)         
        }, this);
        callback(resultFilter)
    }
    initModule = ()=>{
        loadImgs()
        for(let key of filter)  key.addEventListener('click',(e) => select(e,key))
        for (let key of imgs) key.addEventListener('click',(e)=>takeImg(e,key))
        document.getElementById('largeImg').addEventListener('click',()=>getImgs('large',updateListImg))
        document.getElementById('mediumImg').addEventListener('click',()=>getImgs('medium',updateListImg))
        document.getElementById('smallImg').addEventListener('click',()=>getImgs('small',updateListImg))
        document.getElementById('allImg').addEventListener('click',()=>getImgs(null,updateListImg))
        document.getElementById('arrow-prew').addEventListener('click',()=>prevTwentyImgs())
        document.getElementById('arrow-next').addEventListener('click',()=>nextTwentyImgs())
        document.getElementById('filterName').addEventListener('keyup',(e)=>filterName(e,updateListImg))
    }
    return {
        initModule
    }
}())