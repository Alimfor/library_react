import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input, Tooltip, Modal, Popconfirm, notification, Select, message } from 'antd';
import { FileAddOutlined, EditOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { Label } from 'reactstrap';
const { Option } = Select;


const Home = () => {

  const columns = [
    {
      title: 'id',
      dataIndex: 'bookId',
      key: 'id',
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'year',
      dataIndex: 'year',
      key: 'year'
    },
    {
      title: 'full-name',
      dataIndex: 'author',
      key: 'full-name',
      render: (author) => `${author.firstName} ${author.lastName}`
    },
    {
      title: 'category-name',
      dataIndex: ['category', 'name'],
      key: 'category-name'
    },
    {
      title: 'Edit',
      key: 'edit',
      width: '3%',
      render: (row) => {
        return <>
          <EditOutlined
            onClick={(e) => {
              e.preventDefault();
              setMode('edit');
              setIsModalOpen(true);
              setRowId(row.bookId);
              setTitleAdd(row.title);
              setYearAdd(row.year);
              getBookById(row.bookId);

              notification.info({
                message: "Info",
                description: (row.title)
              });
            }}
            style={{
              color: "green", marginLeft: 5
            }}>
          </EditOutlined>
        </>
      }
    },
    {
      title: 'Delete',
      key: 'delete',
      width: '3%',
      render: row => {
        return <>
          <Popconfirm
            title="Are you sure to delete this book?"
            description={row.title + ' - ' + row.year}
            onConfirm={() =>
              confirmToDelete(row.bookId)
            }
            okText="Yes"
            cancelText="No"
          >
            <CloseOutlined
              style={{
                color: "red", marginLeft: 15
              }}>
            </CloseOutlined>
          </Popconfirm>
        </>
      }
    }
  ]

  const [data, setData] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');

  const [titleAdd, setTitleAdd] = useState('');
  const [yearAdd, setYearAdd] = useState('');

  const [authorArr, setauthorArr] = useState([]);
  const [authorAdd, setAuthorAdd] = useState('');
  const handleChangeAuthorAdd = (value) => {
    setAuthorAdd(value);
  };

  const [categoryArr, setCategoryArr] = useState([]);
  const [categoryAdd, setCategoryAdd] = useState('');
  const handleChangecategoryAdd = (value) => {
    setCategoryAdd(value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('');
  const [rowId, setRowId] = useState('');

  const fieldsValidate = () => {
    if (titleAdd === '' || titleAdd === null) {
      notification.error({
        message: "Info",
        description: (
          <>
            Title is empty
          </>
        )
      });
      return;
    }
    else if (yearAdd === '' || yearAdd === null) {
      notification.error({
        message: "Info",
        description: (
          <>
            Year is empty
          </>
        )
      });
      return;
    }

    var id = 0;
    const authorParts = authorAdd.split(' ');
    if (mode === "edit") {
      id = rowId;
    }

    mode === "add"
      ? addBook(authorParts)
      : editBook(id, authorParts);
  }

  const addBook = (authorParts) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          title: titleAdd,
          year: yearAdd,
          author: {
            firstName: authorParts[0],
            lastName: authorParts[1]
          },
          category: {
            name: categoryAdd
          }
        }
      )
    };

    fetch(`http://localhost:5180/api/book/new`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.code === 200 || data.code === 204) {
          notification.info({
            message: `Info ${data.code}`,
            description: (
              <>
                {data.message}
              </>
            )
          });
          setIsModalOpen(false);
          fetchData();
        }
        else {
          notification.error({
            message: `Error ${data.code}`,
            description: (
              <>
                {data.status}
                {data.message}
              </>
            )
          });
        }
      })
  };

  const editBook = (id, authorParts) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(
        {
          bookId: id,
          title: titleAdd,
          year: yearAdd,
          author: {
            firstName: authorParts[0],
            lastName: authorParts[1]
          },
          category: {
            name: categoryAdd
          }
        }
      )
    };

    fetch(`http://localhost:5180/api/book/edit`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.code === 200 || data.code === 204) {
          notification.info({
            message: `Info ${data.code}`,
            description: (
              <>
                {data.message}
              </>
            )
          });
          setIsModalOpen(false);
          fetchData();
        }
        else {
          notification.error({
            message: `Error ${data.code}`,
            description: (
              <>
                {data.status}
                {data.message}
              </>
            )
          });
        }
      })
  }

  const chooseFetch = () => {
    searchTitle === '' ? fetchData() : fetchDataByTitle(searchTitle);
  };

  const fetchData = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`http://localhost:5180/api/book/all`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setData(data);
      })
  };

  const fetchDataByTitle = (title) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`http://localhost:5180/api/book/title/${title}`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setData([data]);
      })
  };

  const fillLists = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:5180/api/author/authors_select`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setauthorArr(data);
      })


    fetch(`http://localhost:5180/api/category/categories_select`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCategoryArr(data);
      })
  }

  const getBookById = (id) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:5180/api/book/${id}`, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCategoryAdd(data.category.name);
        setAuthorAdd(data.author.firstName + ' ' + data.author.lastName);
      })
  }

  const confirmToDelete = (bookId) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:5180/api/book/delete/${bookId}`, requestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        message.success(data.message);
        fetchData();
      })
  }

  const getReportInXlsx = () => {
    const requestOptions = {
      method: 'GET',
      responseType: 'blob'
    };

    fetch(`http://localhost:5180/api/book/report`, requestOptions)
      .then(response => {
        return response.blob();
      })
      .then(xmlData => {
        const blobUrl = window.URL.createObjectURL(xmlData);
        const currentDate = new Date();
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download =
          `${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()}.xlsx`;

        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        message.error('Error downloading XML:', error);
      })
  }

  useEffect(() => {
    fillLists();
  }, []);

  return (
    <div>
      <Modal title={mode}
        open={isModalOpen}
        onOk={() => {
          fieldsValidate();
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}>
        <Space
          direction='vertical'
        >
          <Space
            direction='horizontal'
          >
            <Label>Title</Label>
            <Input
              placeholder="the book title"
              value={titleAdd}
              onChange={(e) => setTitleAdd(e.target.value)}
              style={{
                width: 300,
                marginLeft: 30
              }}
            />
          </Space>

          <Space
            direction='horizontal'
          >
            <Label>Year</Label>
            <Input
              placeholder="publishing year"
              value={yearAdd}
              onChange={(e) => setYearAdd(e.target.value)}
              style={{
                width: 300,
                marginLeft: 30
              }}
            />
          </Space>

          <Space
            direction='horizontal'
          >
            <Label>Author</Label>
            <Select
              style={{
                width: 300,
                marginLeft: 13
              }}
              showSearch
              status="success"
              value={authorAdd}
              optionFilterProp="children"
              onChange={handleChangeAuthorAdd}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {authorArr.map((z) => (
                <Option key={z.name}>{z.name}</Option>
              ))}
            </Select>

          </Space>

          <Space
            direction='horizontal'
          >
            <Label>Category</Label>
            <Select
              style={{
                width: 300,
              }}
              showSearch
              status="success"
              value={categoryAdd}
              optionFilterProp="children"
              onChange={handleChangecategoryAdd}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {categoryArr.map((z) => (
                <Option key={z.name}>{z.name}</Option>
              ))}
            </Select>
          </Space>

        </Space>
      </Modal>

      <Space
        direction='horizontal'
      >
        <Input
          placeholder="the book title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{
            width: 300,
            color: 'red',
            fontWeight: 'bold'
          }}
        />

        <Button
          onClick={() => {
            chooseFetch();
          }}
        >
          Search
        </Button>

        <Tooltip
          title="Addition new book"
          color='green'
        >
          <Button
            icon={<FileAddOutlined />}
            onClick={() => {
              setMode('add');
              setIsModalOpen(true);
              setTitleAdd('');
              setYearAdd('');
            }}
            style={{
              color: 'green'
            }}
          >
          </Button>
        </Tooltip>

        <Tooltip
          title="download xml report"
          color='green'
        >
          <Button
            icon={<FileTextOutlined />}
            onClick={() => getReportInXlsx()}
            style={{
              color: 'green'
            }}
          >
          </Button>
        </Tooltip>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          position: ["topRight"],
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["15", "30", "50", "100", "200"],
          size: 'small'
        }}
        rowKey={record => record.bookId}
      />
    </div>
  )
}

export default Home;