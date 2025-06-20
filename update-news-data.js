// // // 使用 ES 模块导入 child_process 模块
// // import { exec } from 'child_process';
// // import fs from 'fs';
// // import path from 'path';

// // // 启动 test.py 文件
// // exec('python test.py', (error, stdout, stderr) => {
// //     if (error) {
// //         console.error(`执行 test.py 时出错: ${error.message}`);
// //         return;
// //     }
// //     if (stderr) {
// //         console.error(`test.py 输出错误信息: ${stderr}`);
// //         return;
// //     }
// //     console.log(`test.py 执行成功: ${stdout}`);

// //     // 读取 wechat_articles.txt 文件中的 URL 链接
// //     const filePath = path.join(__dirname, 'wechat_articles.txt');
// //     fs.readFile(filePath, 'utf8', (err, data) => {
// //         if (err) {
// //             console.error(`读取文件时出错: ${err.message}`);
// //             return;
// //         }

// //         const urlRegex = /http[s]?:\/\/[^\s]+/g;
// //         const urls = data.match(urlRegex) || [];

// //         // 读取 CoreCapability.vue 文件
// //         const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
// //         fs.readFile(vueFilePath, 'utf8', (readErr, vueData) => {
// //             if (readErr) {
// //                 console.error(`读取 CoreCapability.vue 文件时出错: ${readErr.message}`);
// //                 return;
// //             }

// //             // 找到 newsData 数组的起始位置
// //             const newsDataStartIndex = vueData.indexOf('newsData: [');
// //             if (newsDataStartIndex === -1) {
// //                 console.error('未找到 newsData 数组');
// //                 return;
// //             }

// //             // 找到 newsData 数组的结束位置
// //             const newsDataEndIndex = vueData.indexOf(']', newsDataStartIndex);
// //             if (newsDataEndIndex === -1) {
// //                 console.error('未找到 newsData 数组的结束位置');
// //                 return;
// //             }

// //             // 提取现有的 newsData 数组
// //             const existingNewsData = vueData.slice(newsDataStartIndex, newsDataEndIndex + 1);

// //             // 解析现有的 newsData 数组
// //             const existingNewsDataArray = JSON.parse(`[${existingNewsData.slice('newsData: ['.length, -1)}]`);

// //             // 为每个 URL 创建一个新闻项
// //             const newNewsItems = urls.map(url => ({
// //                 title: '微信文章', // 可以根据需要修改标题
// //                 image: '', // 可以根据需要添加图片链接
// //                 link: url
// //             }));

// //             // 合并现有的 newsData 数组和新的新闻项
// //             const updatedNewsDataArray = [...existingNewsDataArray, ...newNewsItems];

// //             // 将更新后的 newsData 数组转换为字符串
// //             const updatedNewsData = `newsData: ${JSON.stringify(updatedNewsDataArray, null, 2)}`;

// //             // 更新 CoreCapability.vue 文件内容
// //             const updatedVueData = vueData.slice(0, newsDataStartIndex) + updatedNewsData + vueData.slice(newsDataEndIndex + 1);

// //             // 将更新后的内容写回 CoreCapability.vue 文件
// //             fs.writeFile(vueFilePath, updatedVueData, 'utf8', (writeErr) => {
// //                 if (writeErr) {
// //                     console.error(`写入 CoreCapability.vue 文件时出错: ${writeErr.message}`);
// //                     return;
// //                 }
// //                 console.log('CoreCapability.vue 文件更新成功');
// //             });
// //         });
// //     });
// // });



// // 使用 ES 模块导入 child_process 模块
// import { exec } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前脚本所在目录
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 启动 test.py 文件
// exec('python test.py', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`执行 test.py 时出错: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`test.py 输出错误信息: ${stderr}`);
//         return;
//     }
//     console.log(`test.py 执行成功: ${stdout}`);

//     // 读取 wechat_articles.txt 文件中的 URL 链接
//     const filePath = path.join(__dirname, 'wechat_articles.txt');
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error(`读取文件时出错: ${err.message}`);
//             return;
//         }

//         const urlRegex = /http[s]?:\/\/[^\s]+/g;
//         const urls = data.match(urlRegex) || [];

//         // 读取 CoreCapability.vue 文件
//         const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//         fs.readFile(vueFilePath, 'utf8', (readErr, vueData) => {
//             if (readErr) {
//                 console.error(`读取 CoreCapability.vue 文件时出错: ${readErr.message}`);
//                 return;
//             }

//             // 找到 newsData 数组的起始位置
//             const newsDataStartIndex = vueData.indexOf('newsData: [');
//             if (newsDataStartIndex === -1) {
//                 console.error('未找到 newsData 数组');
//                 return;
//             }

//             // 找到 newsData 数组的结束位置
//             const newsDataEndIndex = vueData.indexOf(']', newsDataStartIndex);
//             if (newsDataEndIndex === -1) {
//                 console.error('未找到 newsData 数组的结束位置');
//                 return;
//             }

//             // 提取现有的 newsData 数组
//             const existingNewsData = vueData.slice(newsDataStartIndex, newsDataEndIndex + 1);

//             // 解析现有的 newsData 数组
//             const existingNewsDataArray = JSON.parse(`[${existingNewsData.slice('newsData: ['.length, -1)}]`);

//             // 为每个 URL 创建一个新闻项
//             const newNewsItems = urls.map(url => ({
//                 title: '微信文章', // 可以根据需要修改标题
//                 image: '', // 可以根据需要添加图片链接
//                 link: url
//             }));

//             // 合并现有的 newsData 数组和新的新闻项
//             const updatedNewsDataArray = [...existingNewsDataArray, ...newNewsItems];

//             // 将更新后的 newsData 数组转换为字符串
//             const updatedNewsData = `newsData: ${JSON.stringify(updatedNewsDataArray, null, 2)}`;

//             // 更新 CoreCapability.vue 文件内容
//             const updatedVueData = vueData.slice(0, newsDataStartIndex) + updatedNewsData + vueData.slice(newsDataEndIndex + 1);

//             // 将更新后的内容写回 CoreCapability.vue 文件
//             fs.writeFile(vueFilePath, updatedVueData, 'utf8', (writeErr) => {
//                 if (writeErr) {
//                     console.error(`写入 CoreCapability.vue 文件时出错: ${writeErr.message}`);
//                     return;
//                 }
//                 console.log('CoreCapability.vue 文件更新成功');
//             });
//         });
//     });
// });








// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length > 1) {
//                 const url = parts[1].trim();
//                 urls.push(url);
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf('],', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 2);
//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${(index % 5) + 1}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });
//             const newNewsData = `newsData: [
//                 ${newNewsDataItems.join(',\n')}
//             ]`;
//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }




// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length > 1) {
//                 const url = parts[1].trim();
//                 urls.push(url);
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf('],', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 2);
//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${(index % 5) + 1}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });
//             const newNewsData = `newsData: [
//                 ${newNewsDataItems.join(',\n')}
//             ]`;
//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }





// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length > 1) {
//                 const url = parts[1].trim();
//                 urls.push(url);
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf('],', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 2);
//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${(index % 5) + 1}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });
//             const newNewsData = `newsData: [
//                 ${newNewsDataItems.join(',\n')}
//             ]`;
//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }





// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         const url = line.trim();
//         if (url) {
//             urls.push(url);
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf('],', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 2);
//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${(index % 5) + 1}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });
//             const newNewsData = `newsData: [
//                 ${newNewsDataItems.join(',\n')}
//             ]`;
//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }






// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         const url = line.trim();
//         if (url && !url.startsWith('#')) {
//             urls.push(url);
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 1);
//             const existingNewsItems = originalNewsData.match(/\{[\s\S]*?\}/g) || [];

//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${((index % 5) + 1)}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });

//             const allNewsItems = [...existingNewsItems, ...newNewsDataItems];
//             const newNewsData = `newsData: [
//                 ${allNewsItems.join(',\n')}
//             ]`;

//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }




// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let urls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         const url = line.trim();
//         if (url && !url.startsWith('#')) {
//             urls.push(url);
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (urls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const newNewsDataItems = urls.map((url, index) => {
//                 const title = `微信公众号文章${index + 1}`;
//                 const image = `News${((index % 5) + 1)}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });

//             const newNewsData = `newsData: [
//                 ${newNewsDataItems.join(',\n')}
//             ]`;

//             vueContent = vueContent.slice(0, newsDataStart) + newNewsData + vueContent.slice(newsDataEnd + 1);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }






// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let newUrls = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         const url = line.trim();
//         if (url && !url.startsWith('#')) {
//             newUrls.push(url);
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 存放到 CoreCapability.vue 中的 newsdata 模块下
// if (newUrls.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 1);
//             const existingNewsItems = originalNewsData.match(/\{[\s\S]*?\}/g) || [];

//             // 提取现有的 URL
//             const existingUrls = existingNewsItems.map(item => {
//                 const match = item.match(/link: '([^']+)'/);
//                 return match ? match[1] : null;
//             }).filter(url => url !== null);

//             // 去除重复的 URL
//             const uniqueNewUrls = newUrls.filter(url => !existingUrls.includes(url));

//             const newNewsDataItems = uniqueNewUrls.map((url, index) => {
//                 const title = `微信公众号文章${index + existingNewsItems.length + 1}`;
//                 const image = `News${((index + existingNewsItems.length) % 5) + 1}Img`;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${url}'
//                 }`;
//             });

//             const allNewsItems = [...existingNewsItems, ...newNewsDataItems];
//             const newNewsData = `newsData: [
//                 ${allNewsItems.join(',\n')}
//             ]`;

//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url');
// }







// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前文件的路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的 url 及相关信息
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let newUrlsInfo = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line && !line.startsWith('#')) {
//             const [createTime, cover, title, url] = line.split('@');
//             newUrlsInfo.push({ createTime, cover, title, url });
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的 url 及相关信息存放到 CoreCapability.vue 中的 newsdata 模块下
// if (newUrlsInfo.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 1);
//             const existingNewsItems = originalNewsData.match(/\{[\s\S]*?\}/g) || [];

//             // 提取现有的 URL
//             const existingUrls = existingNewsItems.map(item => {
//                 const match = item.match(/link: '([^']+)'/);
//                 return match ? match[1] : null;
//             }).filter(url => url !== null);

//             // 去除重复的 URL
//             const uniqueNewUrlsInfo = newUrlsInfo.filter(info => !existingUrls.includes(info.url));

//             const newNewsDataItems = uniqueNewUrlsInfo.map((info, index) => {
//                 const image = `News${((index + existingNewsItems.length) % 5) + 1}Img`;
//                 return `{ 
//                     title: '${info.title}', 
//                     image: ${image},
//                     link: '${info.url}',
//                     publishTime: '${info.createTime}',
//                     coverImage: '${info.cover}'
//                 }`;
//             });

//             const allNewsItems = [...existingNewsItems, ...newNewsDataItems];
//             const newNewsData = `newsData: [
//                 ${allNewsItems.join(',\n')}
//             ]`;

//             vueContent = vueContent.replace(originalNewsData, newNewsData);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的 url 及相关信息');
// }






// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前脚本所在目录
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的文章信息
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let articles = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length === 3) {
//                 const title = parts[0].trim();
//                 const image = parts[1].trim();
//                 const url = parts[2].trim();
//                 articles.push({ title, image, url });
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的文章信息存放到 CoreCapability.vue 中的 newsData 模块下
// if (articles.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsData = vueContent.slice(newsDataStart, newsDataEnd + 1);
//             const existingNewsDataText = originalNewsData.slice('newsData: ['.length, -1);

//             const newNewsDataItems = articles.map((article, index) => {
//                 const title = article.title;
//                 const image = article.image ? `'${article.image}'` : `News${(index % 5) + 1}Img`;
//                 const link = article.url;
//                 return `{ 
//                     title: '${title}', 
//                     image: ${image},
//                     link: '${link}'
//                 }`;
//             });

//             const updatedNewsDataText = existingNewsDataText ? `${existingNewsDataText}, ${newNewsDataItems.join(', ')}` : newNewsDataItems.join(', ');
//             const updatedNewsData = `newsData: [${updatedNewsDataText}]`;

//             vueContent = vueContent.slice(0, newsDataStart) + updatedNewsData + vueContent.slice(newsDataEnd + 1);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的文章信息');
// }





// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前脚本所在目录
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的文章信息
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let articles = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length === 3) {
//                 const title = parts[0].trim();
//                 const image = parts[1].trim();
//                 const url = parts[2].trim();
//                 articles.push({ title, image, url });
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的文章信息存放到 CoreCapability.vue 中的 newsData 模块下
// if (articles.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsDataText = vueContent.slice(newsDataStart + 'newsData: ['.length, newsDataEnd);
//             const originalNewsData = originalNewsDataText.match(/\{[\s\S]*?\}/g) || [];
//             const existingUrls = new Set();
//             const newNewsData = [];

//             // 处理原有的 newsData，提取 URL 并去重添加到 newNewsData
//             originalNewsData.forEach(item => {
//                 const urlMatch = item.match(/link:\s*'([^']+)'/);
//                 if (urlMatch) {
//                     const url = urlMatch[1];
//                     if (!existingUrls.has(url)) {
//                         existingUrls.add(url);
//                         newNewsData.push(item);
//                     }
//                 }
//             });

//             // 处理新的文章数据，去重添加到 newNewsData
//             articles.forEach((article, index) => {
//                 const title = article.title;
//                 const image = article.image ? `'${article.image}'` : `News${(index % 5) + 1}Img`;
//                 const link = article.url;
//                 if (!existingUrls.has(link)) {
//                     existingUrls.add(link);
//                     const newItem = `{ 
//                         title: '${title}', 
//                         image: ${image},
//                         link: '${link}'
//                     }`;
//                     newNewsData.push(newItem);
//                 }
//             });

//             const updatedNewsData = `newsData: [
//                 ${newNewsData.join(',\n')}
//             ]`;

//             vueContent = vueContent.slice(0, newsDataStart) + updatedNewsData + vueContent.slice(newsDataEnd + 1);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的文章信息');
// }






// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 获取当前脚本所在目录
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 1. 执行 test.py 文件
// try {
//     execSync('python test.py');
//     console.log('test.py 文件执行成功');
// } catch (error) {
//     console.error('执行 test.py 文件时出错:', error.message);
// }

// // 2. 从 wechat_articles.txt 文件中读取所有的文章信息
// const filePath = path.join(__dirname, 'wechat_articles.txt');
// let articles = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split('\n');
//     for (const line of lines) {
//         if (line.includes('|')) {
//             const parts = line.split('|');
//             if (parts.length === 3) {
//                 const title = parts[0].trim();
//                 const image = parts[1].trim();
//                 const url = parts[2].trim();
//                 articles.push({ title, image, url });
//             }
//         }
//     }
// } catch (error) {
//     console.error('读取 wechat_articles.txt 文件时出错:', error.message);
// }

// // 3. 把读取到的文章信息存放到 CoreCapability.vue 中的 newsData 模块下
// if (articles.length > 0) {
//     const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
//     try {
//         let vueContent = fs.readFileSync(vueFilePath, 'utf8');
//         const newsDataStart = vueContent.indexOf('newsData: [');
//         const newsDataEnd = vueContent.indexOf(']', newsDataStart);
//         if (newsDataStart !== -1 && newsDataEnd !== -1) {
//             const originalNewsDataText = vueContent.slice(newsDataStart + 'newsData: ['.length, newsDataEnd);
//             const originalNewsData = originalNewsDataText.match(/\{[\s\S]*?\}/g) || [];
//             const existingUrls = new Set();
//             const newNewsData = [];

//             // 处理新的文章数据，去重添加到 newNewsData 前面
//             articles.forEach((article, index) => {
//                 const title = article.title;
//                 const image = article.image ? `'${article.image}'` : `News${(index % 5) + 1}Img`;
//                 const link = article.url;
//                 if (!existingUrls.has(link)) {
//                     existingUrls.add(link);
//                     const newItem = `{ 
//                         title: '${title}', 
//                         image: ${image},
//                         link: '${link}'
//                     }`;
//                     newNewsData.unshift(newItem);
//                 }
//             });

//             // 处理原有的 newsData，提取 URL 并去重添加到 newNewsData 后面
//             originalNewsData.forEach(item => {
//                 const urlMatch = item.match(/link:\s*'([^']+)'/);
//                 if (urlMatch) {
//                     const url = urlMatch[1];
//                     if (!existingUrls.has(url)) {
//                         existingUrls.add(url);
//                         newNewsData.push(item);
//                     }
//                 }
//             });

//             const updatedNewsData = `newsData: [
//                 ${newNewsData.join(',\n')}
//             ]`;

//             vueContent = vueContent.slice(0, newsDataStart) + updatedNewsData + vueContent.slice(newsDataEnd + 1);
//             fs.writeFileSync(vueFilePath, vueContent, 'utf8');
//             console.log('CoreCapability.vue 文件更新成功');
//         } else {
//             console.error('未找到 newsData 部分');
//         }
//     } catch (error) {
//         console.error('更新 CoreCapability.vue 文件时出错:', error.message);
//     }
// } else {
//     console.log('未读取到有效的文章信息');
// }





import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前脚本所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 执行 test.py 文件
try {
    execSync('python test.py');
    console.log('test.py 文件执行成功');
} catch (error) {
    console.error('执行 test.py 文件时出错:', error.message);
}

// 2. 从 wechat_articles.txt 文件中读取所有的文章信息
const filePath = path.join(__dirname, 'wechat_articles.txt');
let articles = [];
try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    for (const line of lines) {
        if (line.includes('|')) {
            const parts = line.split('|');
            if (parts.length === 3) {
                const title = parts[0].trim();
                const image = parts[1].trim();
                const url = parts[2].trim();
                articles.push({ title, image, url });
            }
        }
    }
} catch (error) {
    console.error('读取 wechat_articles.txt 文件时出错:', error.message);
}

// 3. 把读取到的文章信息存放到 CoreCapability.vue 中的 newsData 模块下
if (articles.length > 0) {
    const vueFilePath = path.join(__dirname, 'src', 'views', 'CoreCapability.vue');
    try {
        let vueContent = fs.readFileSync(vueFilePath, 'utf8');
        const newsDataStart = vueContent.indexOf('newsData: [');
        const newsDataEnd = vueContent.indexOf(']', newsDataStart);
        if (newsDataStart !== -1 && newsDataEnd !== -1) {
            const originalNewsDataText = vueContent.slice(newsDataStart + 'newsData: ['.length, newsDataEnd);
            const originalNewsData = originalNewsDataText.match(/\{[\s\S]*?\}/g) || [];
            const existingUrls = new Set(articles.map(article => article.url));
            const newNewsData = [];

            // 处理新的文章数据，去重添加到 newNewsData 前面
            articles.forEach((article, index) => {
                const title = article.title;
                const image = article.image ? `'${article.image}'` : `News${(index % 5) + 1}Img`;
                const link = article.url;
                if (!existingUrls.has(link)) {
                    existingUrls.add(link);
                    const newItem = `{ 
                        title: '${title}', 
                        image: ${image},
                        link: '${link}'
                    }`;
                    newNewsData.unshift(newItem);
                }
            });

            // 处理原有的 newsData，只保留 URL 在 txt 文件中的项
            originalNewsData.forEach(item => {
                const urlMatch = item.match(/link:\s*'([^']+)'/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    if (existingUrls.has(url)) {
                        newNewsData.push(item);
                    }
                }
            });

            const updatedNewsData = `newsData: [
                ${newNewsData.join(',\n')}
            ]`;

            vueContent = vueContent.slice(0, newsDataStart) + updatedNewsData + vueContent.slice(newsDataEnd + 1);
            fs.writeFileSync(vueFilePath, vueContent, 'utf8');
            console.log('CoreCapability.vue 文件更新成功');
        } else {
            console.error('未找到 newsData 部分');
        }
    } catch (error) {
        console.error('更新 CoreCapability.vue 文件时出错:', error.message);
    }
} else {
    console.log('未读取到有效的文章信息');
}