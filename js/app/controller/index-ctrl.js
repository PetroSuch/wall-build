
app.controller('indexCtrl', function($scope,FactoryCrud) {
    $scope.wall_size ={'h':3,'w':6};
    $scope.wall = [];
    $scope.bricks = [
        {'w':1,'h':1,'k':4},
        {'w':2,'h':1,'k':6},
        {'w':1,'h':3,'k':1},
        {'w':3,'h':4,'k':5},
    ]
   

    $scope.build = function(){
        $scope.wall = []
        $scope.bricks = [
        {'w':1,'h':1,'k':4},
        {'w':2,'h':1,'k':6},
        {'w':1,'h':3,'k':1},
        {'w':3,'h':4,'k':5},
    ]
        for (var i = 0; i < $scope.wall_size.h; i++) {
            $scope.wall[i] = {}
            for (var j = 0; j < $scope.wall_size.w; j++) {
                $scope.wall[i][j] = ' o '
            }  
        }
        //setTimeout(()=>{
            for (var y = 0; y < 5; y++) {
                for(var k in $scope.bricks){
                    if($scope.bricks[k]['k'] > 0){
                        for (var i = 0; i < $scope.bricks[k]['k']; i++) {
                            $scope.findFreeSpaceForBrick($scope.bricks[k]['w'],$scope.bricks[k]['h'],k)
                        }
                    }
                    
                }
            }
        //},2000)
        
    }
     
    $scope.findFreeSpaceForBrick = function(w,h,block_type){
        var wall = $scope.wall
        var wall_width = $scope.wall_size.w
        var cor_x = [];
        /*Шукаємо вільні місця по горизонталі*/
        for (var i = 0; i < wall.length; i++) {
            cor_x[i] = [];
           var c = [];
           for (var j = 0; j < wall_width; j++) {
               if(wall[i][j] == ' o '){
                   c.push(j);
               }
           }
           if(c.length >= w){
               cor_x[i] = c;
           }
        }
        /*Шукаємо збіги чисел з однаковими індексами по вертикалі 
           1,2,3,4,5
             2,3,4,5
        */
        var same_num = [];
        for (var i = 0; i < cor_x.length; i++) {
            same_num[i] = []
            for (var j = 0; j < cor_x[i].length; j++) {
                if(w > 1){
                    if(typeof cor_x[i+1] != 'undefined' && cor_x[i+1].indexOf(cor_x[i][j]) != -1){
                        same_num[i].push(cor_x[i][j])
                    }
                    if(h == 1 ){
                            same_num[i].push(cor_x[i][j])
                        
                    }

                    if(i+1 == cor_x.length){
                        if(typeof cor_x[i-1] != 'undefined' && cor_x[i-1].indexOf(cor_x[i][j]) != -1){
                            same_num[i].push(cor_x[i][j])
                        }
                    }
                }else{
                    same_num[i].push(cor_x[i][j])
                }
                
            }
        }
        
        /*
        Шукаємо вільні місця які рівня  ширині блоку
        */
        same_num_width = [];
         for (var i = 0; i < same_num.length; i++) {
            same_num_width[i] = []
            for (var j = 0; j < same_num[i].length; j++) {

                if(typeof same_num[i][j+1] != 'undefined' && same_num[i][j] == same_num[i][j+1]-1){
                    if(same_num_width[i].indexOf(same_num[i][j]) == -1){
                        same_num_width[i].push(same_num[i][j])
                    }

                }if(typeof same_num[i][j+1] != 'undefined' && same_num[i][j] != same_num[i][j+1]-1){

                    if(same_num_width[i].indexOf(same_num[i][j]) == -1){
                        same_num_width[i].push(same_num[i][j])
                    }
                    
                }else{
                    if(typeof same_num[i][j+1] == 'undefined'){
                        if(same_num_width[i].indexOf(same_num[i][j]) == -1){
                            same_num_width[i].push(same_num[i][j])
                        }
                    }
                    
                }
                if(typeof same_num[i][j+1] != 'undefined' && same_num[i][j] != same_num[i][j+1]-1){
                    if(same_num_width[i].length < w){
                        same_num_width[i] = []
                    }
                  
                }
            }
        }
/*
        var matrix = [];
        var help_count = 0;
        for (var y = 0; y < $scope.wall_size.w; y++) {
            matrix[help_count] = [];
            for (var i = 0; i < same_num_width.length; i++) {
                if(matrix)
                matrix[help_count].push(same_num_width[i][help_count]);
                if(i+1 == same_num_width.length){
                    help_count++;
                }             
            }
        }
        console.log(w,h,matrix)
        return false*/
/*Перевіряємо чи сформований массив по вертикалі і горизонталі і його ширина/довжина  рівна чи більша за цеглу*/
        var allow_insert = true;
        for (var i = 0; i < same_num_width.length; i++) {
            if(same_num_width[i].length < w){
                allow_insert = false
            }else{
                allow_insert = true
            }
        }
        if(h >= same_num_width.length){

            for (var i = same_num_width.length - 1; i >= 0; i--) {
                if(same_num_width[i] == ' o '){
                     allow_insert = false
                }
            }
           
        }
        console.log(h,same_num_width.length)
        if(same_num_width.length < h){
            allow_insert = false
        }
        
        /*Формуємо двохмірний массив координат де можна розмістити цеглу*/
        var matrix = [];

        for (var i = 0; i < same_num_width.length; i++) {
            matrix[i] = [];

            for (var j = 0; j < same_num_width[i].length; j++) {
                if(matrix[i].length < w){
                    matrix[i].push(same_num_width[i][j])
                }
            }
        }
        console.log(w,h,allow_insert,same_num_width)
       
        /*Перевірка на дозвіл додавання цегли*/
       // console.log(w,h,matrix)
        if(allow_insert){
            $scope.bricks[block_type]['k'] -= 1;
            var operation = 0;
            /*Додавання цегли*/
            //wall = wall.reverse()
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    operation++;
                    if(operation <= h*w){
                         wall[i][matrix[i][j]] = w+'x'+h

                    }
                 
                }
            }
            //wall = wall.reverse()
           
        }       
    }
    /*Запускаємо будівництво з наявних блоків, дозволяємо пять повторних проходів */
   
   $scope.build()
});

