//这里也可以直接在外层的参数总直接输入{pokemonsLists}，表示接受到{xx}的值
//这就是解构赋值！！
const Lists = ({pokemonsLists}) => {
    const imgCSS={
        border:"1px solid orange",
        borderRadius:"10px",
    }
    return(
        <ul className="ul-container">
            {
                pokemonsLists.map((pokemon) => {
                    return (
                        <div key={pokemon.url}>
                            <li>{pokemon.name}</li>
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                style={imgCSS}
                            />
                        </div>
                    );
                })
            }
        </ul>
    );
};




/*
class Lists extends React.Component{
    render(){

        //1.这里是把{a}={b}，b是一个数组，a也就是一个数组，
        //这个跟函数组件的差别是，函数组件在函数名（{a，b}）的时候已经把{给写出来了}，用的时候直接用里面的参数就可以
        //类组件没有括号传递参数，因此需要创建一个变量去传参数，这个变量就需要大括号
        //这里的this.props就是app上面给的名字的值，就是pokemonLists
        const { pokemonsLists }=this.props;
        const imgCSS={
            border:"1px solid orange",
            borderRadius:"10px",
        }

        //2.筛选数据之后，只有列表的文字更新，图片没有更新，
        //因为列表使用的是filter的，filter作为一个新的数组进行map，无论如何，map的index都是从0开始的
        //挂载的时候，为每个元素增加一个属性，对应到图片编号上
        return(
            <ul className="ul-container">
                {
                    pokemonsLists.map((pokemon) => {
                        return (
                            <div key={pokemon.url}>
                                <li>{pokemon.name}</li>
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                    style={imgCSS}
                                />
                            </div>
                        );
                    })
                }
            </ul>
        );
    }
}
*/




