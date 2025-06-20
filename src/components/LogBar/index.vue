<template>
    <div class="logbar">
        <div class="option-bar">
            <div style="width: 50%;">
            </div>
            <div style="width: 50%; display: flex; align-items: center;">
                <input
                style="width: 50%; border: 1px solid #ccc; outline: none; height: 20px; box-sizing: border-box;"
                type="text"
                placeholder="Filter..."
                >
                <div style="width: 50%; height: 100%; box-sizing: border-box; display: flex; align-items: center; align-items: center; direction: rtl; gap: 10px;">
                    <i style="font-size: 15px; margin-right: 5px;" @click="hideLog" class="fa-solid fa-square-caret-down"></i>
                    <i style="font-size: 15px;" class="fa-solid fa-square-caret-up"></i>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    name : 'LogBar',
    
}
</script>
<style scoped>
.logbar {
    width: 100%;
    box-sizing: border-box;
    border-left: none;
    border-right: none;
    height: 100%;
}

.table-content::-webkit-scrollbar {
    display: none; 
}


.option-bar {
    width: 100%;
    height: 30px;
    display: flex;
    box-sizing: border-box;
}
.table-content {
    width: 100%;
    height: calc(100% - 30px);
    border: 1px #012596 solid;
    box-sizing: border-box;
    -ms-overflow-style: none; 
    scrollbar-width: none;  
    overflow-y: scroll; 
    position: relative;
}
.log-body {
    width: 100%;
    height: calc(100% - 30px);
    overflow: auto;
    box-sizing: border-box;
}

.header {
    width: 100%;
    display: flex;
    height: 30px;
    box-sizing: border-box;
    background-color: #ddd;
    position: sticky;
    top: 0;
    z-index: 10; 
}

.content {
    display: flex;
    width: 100%;
    height: calc(100%/3 );
    box-sizing: border-box;
    background-color: white;
}

.content:hover {
    background-color: #ddd;
}

.content-log {
    width: 100%;
    height: calc(100% - 30px);
}

.icon {
    width: 5%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
}
.header-icon {
    width: 10%;
    font-weight: 700;
    border: 1px solid white;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 5px;
    box-sizing: border-box;
}

</style>
