import React from 'react'
import './lex.css'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Select,
    DatePicker,
    Table,
    Popconfirm,
    Button,
    Tooltip,
    Tag, Space,
    Modal,
    message,
    Tabs,
    Drawer
  } from 'antd';


import axios from 'axios';

// 样例
const g1 = "if i=0 then n++;<br />a<=3b%);"

// 行内注释
const g2 = "if i=0 then n++;<br />// test<br />a<=3b%);"


// 字符串
const g3 = 'if i=0 then n++;<br />a<=3b%);<br />// test<br />string s="hello";<br />i=0'


class Lex extends React.Component{
    constructor(props){
        super(props)
        this.state={
            visible:false,
            modal_visible:false,
            delete_visible:false,
            delimiter_visible:false,
            delete_delimiter_visible:false,
            color:[
                "#3F51B5"
            ],
            categories:["do","end","for","if","printf","scanf","then","while"],
            delimiter:[",",";","(",")","[","]","{","}" ],
            categories_save:[],
            data:[
                  
            ],
            delimiter_save:[],
            drawerVisible:false
        }
    }
    formRef = React.createRef();
    formRef2= React.createRef();
    formRef3= React.createRef();
  
    render(){
        const columns = [
            {
              title: '单词',
              dataIndex: 'word',
              key: 'word',
            },
            {
              title: '种类',
              key: 'category',
              dataIndex: 'category',
              render: text =>{
                  switch(text){
                        case"关键字":
                            return(<span style={{background:"#5E72E4",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)

                        case"分界符":
                            return(<span style={{background:"#8BC34A",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"算术运算符":
                            return(<span style={{background:"#636267",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"关系运算符":
                            return(<span style={{background:"#A86FC7",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"无符号数":
                            return(<span style={{background:"#4A8FA1",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"标识符":
                            return(<span style={{background:"#FFC107",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"行内注释":
                            return(<span style={{background:"#02475e",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"字符串":
                            return(<span style={{background:"#ff6701",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                        case"ERROR":
                            return(<span style={{background:"#ff414d",padding:"3px",borderRadius:"5px",color:"#fff"}}>{text}</span>)
                  }
              }
            },
            {
              title: '位置',
              key: 'position',
              dataIndex:'position'
            },
        ];
        const columns2 = [
            {
              title: '关键字',
              dataIndex: 'category',
              key: 'category',
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => (
                <Space size="middle">
                  <a onClick={this.handleDelete.bind(this,record.key)}>Delete</a>
                </Space>
              ),
            },
            
          ];
          const columns3 = [
            {
              title: '分界符',
              dataIndex: 'delimiter',
              key: 'delimiter',
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => (
                <Space size="middle">
                  <a onClick={this.handleDelimiterDelete.bind(this,record.key)}>Delete</a>
                </Space>
              ),
            },
            
          ];
          
        return(
            <div className="container">
                <div className="left-side">
                    <Card title="自定义关键字" size="small"  style={{marginBottom:"15px"}}>
                    {
                        this.state.categories.map((item,index)=>{
                            return(
                                <Tooltip title={item}  key={item}>
                                    <Button style={{marginRight:"10px",marginBottom:"10px"}}>{item}</Button>
                                </Tooltip>
                            )
                        })
                    }
                    <Button type="primary" onClick={this.showModal.bind(this)} style={{marginRight:"20px"}}>删除</Button>
                    <Button type="primary" onClick={this.showModalDelete.bind(this)}>增加</Button>
                    </Card>
                    <Card title="自定义分界符" size="small"  style={{marginBottom:"15px"}}>
                    {
                        this.state.delimiter.map((item,index)=>{
                            return(
                                <Tooltip title={item}  key={item}>
                                    <Button style={{marginRight:"10px",marginBottom:"10px"}}>{item}</Button>
                                </Tooltip>
                            )
                        })
                    }
                    <Button type="primary" onClick={this.deleteDelimiter.bind(this)} style={{marginRight:"20px"}}>删除</Button>
                    <Button type="primary" onClick={this.addDelimiter.bind(this)}>增加</Button>
                    </Card>
                    <Card title="输入代码" size="small"  extra={<a onClick={this.showDrawer.bind(this)}>👋 Examples</a>}>
                        <Form layout="vertical" ref={this.formRef}>
                            <Form.Item name="words" rules={[{ required: true, message: '请输入词法' }]}>
                                <Input.TextArea style={{height:"200px"}}></Input.TextArea>
                            </Form.Item>
                        </Form>
                        <Row justify="end" gutter={16}>     
                            <Col>
                                <Button type="danger" onClick={this.clearForm.bind(this)} >清空</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={this.clickButton.bind(this)}>分析</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className="right-side">
                    <Card title="种类" size="small">
                        <Button style={{marginRight:7,background:"#5E72E4", color:"#fff",borderRadius:"4px",fontSize:13.5}}>关键字</Button>
                        <Button style={{marginRight:7,background:"#8BC34A",color:"#fff",borderRadius:"4px",fontSize:13.5}}>分界符</Button>
                        <Button style={{marginRight:7,color:"#fff",background:"#636267",borderRadius:"4px",fontSize:13.5}}>算术运算符</Button>
                        <Button style={{marginRight:7,color:"#fff",background:"#A86FC7",borderRadius:"4px",fontSize:13.5}}>关系运算符</Button>
                        <Button style={{marginRight:7,color:"#fff",background:"#4A8FA1",borderRadius:"4px",fontSize:13.5}}>无符号数</Button>
                        <Button style={{marginRight:7,background:"#FFC107",color:"#fff",borderRadius:"4px",fontSize:13.5}}>标识符</Button>
                        <Button style={{color:"#fff",background:"#02475e",marginRight:7,borderRadius:"4px",fontSize:13.5}}>行内注释</Button>
                        
                        <Button style={{color:"#fff",background:"#ff6701",marginRight:7,borderRadius:"4px",fontSize:13.5}}>字符串</Button>

                        <Button style={{color:"#fff",background:"#ff414d",borderRadius:"4px",fontSize:12}}>错误</Button>
                        
                    </Card>
                    <Card title="分析结果" size="small"  style={{marginBottom:"50px"}}>
                    <Table columns={columns} dataSource={this.state.data} pagination={false}/> 
                    </Card>
                </div>
                <Modal title="删除关键字"  footer={[
                    <Button key="sure" type="primary"  onClick={this.handleOk.bind(this)}>
                        确认  
                    </Button>,          
                    ]}
                    visible={this.state.modal_visible} 
                    onOk={this.handleOk.bind(this)} 
                    closable={false}>
                        <Table columns={columns2} dataSource={this.state.categories_save} pagination={false}/>
                </Modal>
                <Modal title="输入关键字"  footer={[
                    <Button key="sure" type="primary"  onClick={this.handleAdd.bind(this)}>
                        确认  
                    </Button>,   
                    ]}
                    visible={this.state.delete_visible}  
                    onCancel={this.handleCancel.bind(this)}>
                        <Form ref={this.formRef2}>
                            <Form.Item label="关键字种类" name="keyword" rules={[{ required: true, message: '关键字名称不能为空' }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                </Modal>
                <Modal title="删除分界符"  footer={[
                    <Button key="sure" type="primary"  onClick={this.handleDelimiterOk.bind(this)}>
                        确认  
                    </Button>,          
                    ]}
                    visible={this.state.delete_delimiter_visible} 
                    onOk={this.handleDelimiterOk.bind(this)} 
                    closable={false}>
                        <Table columns={columns3} dataSource={this.state.delimiter_save} pagination={false}/>
                </Modal>
                <Modal title="输入分界符"  footer={[
                    <Button key="sure" type="primary"  onClick={this.handleAddDelimiter.bind(this)}>
                        确认  
                    </Button>,   
                    ]}
                    visible={this.state.delimiter_visible}  
                    onCancel={this.handleCancelDelimiter.bind(this)}>
                        <Form ref={this.formRef3}>
                            <Form.Item label="分界符" name="delimiter" rules={[{ required: true, message: '分界符不能为空' }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                </Modal>
                <Drawer
                    title="🗃 Examples"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={400}
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane
                        tab={
                            <span>
                            🧭  样例
                            </span>
                        }
                        key="1"
                        >
                        <Card size={'small'}>
                            <Card title="代码" bordered={false} size={'small'}>
                                <p dangerouslySetInnerHTML={{__html: g1}}></p>
                            </Card>
                            
                            <Row justify="end">     
                                <Col>
                                    <Button type="link" style={{marginRight:'10px'}} size={'large'} onClick={this.Fill1.bind(this)}>Fill</Button>
                                </Col>
                            </Row>
                        </Card>
                        </Tabs.TabPane>
                        <Tabs.TabPane
                        tab={
                            <span>
                            📃  行内注释
                            </span>
                        }
                        key="2"
                        >
                            <Card size={'small'}>
                                <Card title="代码" bordered={false} size={'small'}>
                                    <p dangerouslySetInnerHTML={{__html: g2}}></p>
                                </Card>
                             
                                <Row justify="end">     
                                    <Col>
                                        <Button type="link" style={{marginRight:'10px'}} size={'large'} onClick={this.Fill2.bind(this)}>Fill</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Tabs.TabPane>

                        <Tabs.TabPane
                        tab={
                            <span>
                            ⚙️  字符串
                            </span>
                        }
                        key="3"
                        >
                        <Card size={'small'}>
                            <Card title="代码" bordered={false} size={'small'}>
                                <p dangerouslySetInnerHTML={{__html: g3}}></p>
                            </Card>
                          
                            <Row justify="end">     
                                <Col>
                                    <Button type="link" style={{marginRight:'10px'}} size={'large'} onClick={this.Fill3.bind(this)}>Fill</Button>
                                </Col>
                            </Row>
                        </Card>
                        </Tabs.TabPane>
                        
                    </Tabs>,
                    
                </Drawer>
            </div>
        )
    }

    showDrawer () {
        this.setState({
            drawerVisible:true
        })
    };
    
    onClose = () => {
        this.setState({
            drawerVisible:false
        })
    };
    // 样例 
    Fill1(){
        this.formRef.current.setFieldsValue({
            words:"if i=0 then n++;\na<=3b%);",
        });
        this.setState({
            drawerVisible:false
        })
    }
    // 行内注释 
    Fill2(){
        this.formRef.current.setFieldsValue({
            words:"if i=0 then n++;\n// test\na<=3b%);",
        });
        this.setState({
            drawerVisible:false
        })
    }
    // 字符串
    Fill3(){
        this.formRef.current.setFieldsValue({
            words:'if i=0 then n++;\na<=3b%);\n// test\nstring s="hello";\ni=0',
        });
        this.setState({
            drawerVisible:false
        })
    }
    clickButton(){
        const key="analyse"
        let { validateFields } = this.formRef.current;
        validateFields().then( (value) => {
            message.loading({ content: '分析中...',key });
            // 处理自定义关键字
            var str=""
            if(this.state.categories.length>1){
                for(let i=0;i<this.state.categories.length-1;i++){
                    str+=this.state.categories[i]+" "
                }
                str+=this.state.categories[this.state.categories.length-1]
            }
            else{
                str=this.state.categories[0];
            }
            // 处理自定义分界符
            var str2=""
            if(this.state.delimiter.length>1){
                for(let i=0;i<this.state.delimiter.length-1;i++){
                    str2+=this.state.delimiter[i]+" "
                }
                str2+=this.state.delimiter[this.state.delimiter.length-1]
            }
            else{
                str2=this.state.delimiter[0];
            }
            axios.get('/lex', {
                params: {
                    words: value.words,
                    keywords:str,
                    delimiters:str2
                    
                },
            }).then((res)=>{
                let data=res.data;
                data = data.substr(0, data.length - 1);
                let words=data.split("\n")

                let datas=[]
                for(let i=0;i<words.length;i++){
                    let one_word=words[i].split(" ")
                    var str="";
                    switch(one_word[one_word.length-3]){
                        case "1":
                            str="关键字"
                            break
                        case "2":
                            str="分界符"
                            break
                        case "3":
                            str="算术运算符"
                            break
                        case "4":
                            str="关系运算符"
                            break
                        case "5":
                            str="无符号数"
                            break
                        case "6":
                            str="标识符"
                            break
                        case "7":
                            str="行内注释"
                            break
                        case "8":
                            str="字符串"
                            break
                        default:
                            str="ERROR"
                    }
                    let word_str=[];
                    for(let i=0;i<one_word.length-3;i++){
                        word_str.push(one_word[i]);
                    }
                    let word_s=word_str.join(" ");
                    console.log(one_word);
                    let p="("+one_word[one_word.length-2]+","+one_word[one_word.length-1]+")"
                    let t={
                      word:word_s,
                      category:str,
                      position:p
                    }
                    datas.push(t)
                }
                console.log(datas);
                this.setState(
                    {
                        data:datas
                    }
                )
                message.success({ content: '分析成功!',key, duration: 1.5 });
            })
            
        })
        .catch((err)=>{
            message.error({content:'词法表达式不能为空',key, duration:1.5});
        })
    }
    handleOk() {
        let data=[];
        for(var i=0;i<this.state.categories_save.length;i++){
            data.push(this.state.categories_save[i].category)
        }
        this.setState({
            modal_visible:false,
            categories:data
        })
    };
    handleDelimiterOk(){
        let data=[];
        for(var i=0;i<this.state.delimiter_save.length;i++){
            data.push(this.state.delimiter_save[i].delimiter)
        }
        this.setState({
            delete_delimiter_visible:false,
            delimiter:data
        })
    }
    
    showModal(){
        let data=this.state.categories.map((item,index)=>({
            category:item,
            key:index
        }))
        this.setState({
            modal_visible:true,
            categories_save:data
        })
    }
    handleDelete(key){
        const dataSource = [...this.state.categories_save];
        this.setState({ categories_save: dataSource.filter(item => item.key !== key) });
    }
    handleDelimiterDelete(key){
        const dataSource = [...this.state.delimiter_save];
        this.setState({ delimiter_save: dataSource.filter(item => item.key !== key) });
    }
    showModalDelete(){
    
        this.setState({
            delete_visible:true,

        })
    }
    handleAddDelimiter(){
        let { validateFields } = this.formRef3.current;
        validateFields().then( (value) => {
            this.state.delimiter.push(value.delimiter)
            this.formRef3.current.setFieldsValue({
                delimiter:""
            })
            this.setState({
                delimiter_visible:false
            })
        })
    }
    handleCancelDelimiter(){
        this.setState({
            delimiter_visible:false,
        })
    }
    handleAdd(){
        let { validateFields } = this.formRef2.current;
        validateFields().then( (value) => {
            this.state.categories.push(value.keyword)
            this.formRef2.current.setFieldsValue({
                keyword:""
            })
            this.setState({
                delete_visible:false
            })
        })
    }
    clearForm(){
        this.formRef.current.setFieldsValue({
            words:""
        })
    }
    handleCancel(){
        this.setState({
            delete_visible:false,
        })
    }
    deleteDelimiter(){
        let data=this.state.delimiter.map((item,index)=>({
            delimiter:item,
            key:index
        }))
        this.setState({
            delete_delimiter_visible:true,
            delimiter_save:data
        })
        console.log(this.state.delimiter_save);
    }
    addDelimiter(){
        this.setState({
            delimiter_visible:true,

        })
    }
}

export default Lex



