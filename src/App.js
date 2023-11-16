//这里用的是箭头函数的写法，可以写成function App(){}函数声明的格式。也可以写成const App=function(){}函数表达式
const App = () => {

    //初始化
    //函数组件没有构造函数，因此不能在constructor那里定义初始state，使用useState
    const [pokemons, setPokemons] = React.useState([]);
    const [filteredPokemons, setFilteredPokemons] = React.useState([]);

    //函数组件没有componentDidMount的方法，把挂载放在初始值之后执行
    //但是类组件是在状态值更新时才会执行组件的内容，函数组件则是从上到下执行
    //挂载把状态值改写了，改了之后执行函数组件的内容，然后又挂载又改
    //fetch对app有副作用，不能用，改用useEffect(函数,[])，第二个参数是定义什么时候执行，什么时候再执行
    //第二个参数如果是空数组，表示前面的函数只需要执行一次就可以了

    //挂载
    React.useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon")
            .then(res => res.json())
            .then(json => {
                json.results.map((result, index) => {
                    result.id = index + 1;
                });
                setPokemons(json.results);
                setFilteredPokemons(json.results);
            });
    }, []);

    //事件触发
    const onChangeHandler = event => {
        const comparePokemons = pokemons.filter(pokemon => {
            return pokemon.name.includes(event.target.value);
        });
        setFilteredPokemons(comparePokemons);
    };

    //返回
    return (
        <div>
            <h1>Pokemon</h1>
            <Input onChangeHandler={onChangeHandler} />
            <Lists pokemonsLists={filteredPokemons} />
        </div>
    );
}

/*
class App extends React.Component {
    
    //1.数组应该在类初始化的时候就要有了，因为此时的类是输出一个unorderlist的，把数组放到constructor里面
    //2.因为数组在return的时候才会出现，就产生了时间差，就会有状态的概念，
    //要动态的管理就需要把数组设置成初始的状态，放到构造函数的state的value里面，用对象的格式(为什么要用键值对的形式)

    //构造函数
    constructor() {
        console.log("构造");
        //这里是把父类的所有方法继承过来，用到的是super
        //定义一些变量，用来作为初始值
        super();
        this.state = {
            pokemons: [],
            filteredPokemons: [],
        };
    }

    //1.实际上页面不会写死一个数组，因为数据随时可能发生变化，所以用获取的api放到数组里面
    //但是获取api的数据的速度是未知的，要先让轮廓能够保证先出现，用到react提供的componentDidMount
    //把api网址先挂起来，用fetch，然后把数据变为json格式，然后用控制台打印先看一下
    //json其实是api返回的最外层的【对象】，再提取里面的results属性的值，也就是我们最后想要的数组
    
    //2.那如果我就把json.results赋值给this.state.pokemons可以吗，可以是可以，控制台打印出来了，但是页面没有刷新成功
    //因为在react里面，用赋值的操作去修改属性，内存地址是不变的，解决方式是创建一个新的对象，用setState
    //因此const[a,b]有两个好处，一个是可以用于新建对象接受api的值，另一个是给一个状态的概念进行动态管理
    
    //3.但是如果本来我本地也有一个数组有一些数据，同时我也需要api的数据，直接setState的话api的数据会覆盖原有的本地数据
    //此时打印台是本地数据，网页是api数据，因为setState是回调函数，先执行打印，把当前本地的东西输出，再执行回调，获取api
    //实际上setState并不会覆盖原有的数据，只是浅合并，只改要改的，不改不动

    //4.filteredPokemons的初始值要和初始的pokemons状态值是一样的，也需要api，所以要在这里写


    //挂载组件
    componentDidMount() {
        console.log("挂载");
        fetch("https://pokeapi.co/api/v2/pokemon")
            .then(res => res.json())
            .then(json => {
                json.results.map((result, index) => {
                    result.id = index + 1;
                });
                this.setState(
                    //这里setState有两个参数，第一个参数是需要更新的值，第二个参数是更新值之后的操作
                    //强行把打印和更新两个操作的执行顺序换了一下
                    () => {
                        return {
                            pokemons: json.results,
                            filteredPokemons: json.results,
                        };
                    },
                    () => {
                        console.log(this.state);
                    }
                );
            });
    }

    //因为副本存了我们过滤之后的列表了，这时不需要记录用户输入的值了，把searching可以删掉
    //把副本的值给到过滤列表这个变量，对他进行原地更新
    //为什么要存副本？好操作！

    onChangeHandler = event => {
        const comparePokemons = this.state.pokemons.filter(pokemon => {
            return pokemon.name.includes(event.target.value);
        });
        this.setState(
            () => {
                return { filteredPokemons: comparePokemons };
            },
            () => {
                console.log(this.state.searching)
            }
        );
    }

    //渲染
    render() {
        console.log("渲染");
        return (

            //1.用到了插值表达式，即<html>{xxxx}</html>,但是这么写肯定会被骂死的，涉及数组要用遍历的方法
            //也就是把<li>{pokemons[0]}</li>
            //        <li>{pokemons[1]}</li>
            //        <li>{pokemons[2]}</li>
            //改成用map的方式输出li
    
            //2.遍历时应该为每个子项目设置一个唯一的key属性，后期只需要更新某一个时就可以只更新那一个
            //因为每一个li的URL都不一样，所以可以用pokemon对象里面的urlkey作为key
            //但是如果报错，改为用index作为key检查没问题，那就是key出了问题
            //这里涉及到底层运行逻辑，电脑会先运行constructor，再运行render，最后才运行componentDidMount的挂载功能，最后再渲染
            //所以在第一次render的时候，已经把本地数据的数组的字符串作为key了，获取不到url
            //所以解决方式是把初始的数组设置为空
    
            //3.注意，jsx输出只能是一个东西，所以要用div进行括起来


            //新功能：用户输入框输入的东西可以筛选
            //1.（不需要了额）肯定要设置状态的，首先要设置一个初始值（初始变量上面的searching），
            //然后把用户输入的东西保存起来,在监听到event时候，用setState把原来的state的searching的value值进行改变
            //这里用到浅合并，强行把打印工作放到回调函数之后才执行

            //2.注意尽可能不要把过多代码写在return的html里面，新建一个类把它们挪出来
            //注意：调用类方法的时候一定要写上this，相当于一个黑社会老大下面的平行兄弟，想要调用对方的方法，先把老大的名字称呼上
            
            //3.用户输入的值保存起来之后要更新列表，
            //不能对原有数组进行修改，新建一个新的状态对象,因为涉及到api，其初始值也是先要与原来的pokemons是一样的
            //那在哪里更新数组的，一个一个来看，在构造函数初始化的时候嘛，不行，组件挂载的时候？不行，组件挂载是将第一次没筛选时看到的全部内容列出来
            //渲染的时候？更不行，渲染时更新数组，数组更新完又渲染，陷入死循环。
            //应该在事件发生时，也就是onchangehandle的时候

            <div>
                <h1>Pokemon</h1>
                <Input onChangeHandler={this.onChangeHandler} />
                <Lists pokemonsLists={this.state.filteredPokemons} />
            </div>
        );
    }
}
*/




