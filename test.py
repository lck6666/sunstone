# # import requests
# # import time
# # import json
# # import os

# # TOKEN_CACHE_FILE = "wechat_token_cache.json"

# # def get_access_token(appid, appsecret):
# #     # 尝试从缓存读取未过期的token
# #     if os.path.exists(TOKEN_CACHE_FILE):
# #         try:
# #             with open(TOKEN_CACHE_FILE, "r") as f:
# #                 cache = json.load(f)
# #                 if cache["expire_time"] > time.time() + 60:  # 提前60秒过期
# #                     return cache["access_token"]
# #         except:
# #             pass  # 读取失败则重新获取
    
# #     # 重新获取token
# #     url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={appsecret}"
# #     for i in range(3):  # 重试3次
# #         response = requests.get(url).json()
# #         if "access_token" in response:
# #             # 缓存token
# #             with open(TOKEN_CACHE_FILE, "w") as f:
# #                 json.dump({
# #                     "access_token": response["access_token"],
# #                     "expire_time": time.time() + response["expires_in"] - 200  # 提前200秒过期
# #                 }, f)
# #             return response["access_token"]
# #         elif "errcode" in response:
# #             print(f"获取token失败 (尝试 {i+1}/3): {response}")
# #             if response["errcode"] == 40164:  # IP不在白名单
# #                 print("请在微信公众平台添加当前IP到白名单:", requests.get("https://api.ipify.org").text)
# #                 return None
# #             time.sleep(1)  # 重试前等待1秒
    
# #     raise Exception("获取AccessToken失败，已达到最大重试次数")

# # def get_published_articles(access_token, offset=0, count=10):
# #     url = f"https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token={access_token}"
# #     data = {
# #         "offset": offset,
# #         "count": count,
# #         "no_content": 0
# #     }
# #     response = requests.post(url, json=data).json()
# #     print(f"接口返回: {response}")  # 打印原始响应
    
# #     if "errcode" in response and response["errcode"] != 0:
# #         raise Exception(f"获取文章失败: {response}")
    
# #     articles = []
# #     if "item" in response:
# #         for item in response["item"]:
# #             if "content" in item and "news_item" in item["content"]:
# #                 for news in item["content"]["news_item"]:
# #                     articles.append({
# #                         "title": news["title"],
# #                         "url": news["url"],
# #                         "create_time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(item["create_time"]))
# #                     })
# #     return articles

# # # 获取所有已发布文章（支持分页）
# # def get_all_published_articles(access_token):
# #     all_articles = []
# #     offset = 0
# #     count = 20  # 每次获取20条，最大为20
    
# #     while True:
# #         print(f"正在获取第 {offset//count + 1} 页文章...")
# #         articles = get_published_articles(access_token, offset, count)
# #         if not articles:
# #             print(f"第 {offset//count + 1} 页无文章，结束获取")
# #             break
# #         all_articles.extend(articles)
# #         print(f"第 {offset//count + 1} 页获取到 {len(articles)} 篇文章")
# #         if len(articles) < count:  # 不足count条，说明已获取完所有文章
# #             break
# #         offset += count
    
# #     return all_articles

# # # 使用示例
# # if __name__ == "__main__":
# #     appid = "wxcf66c3b0f23704e7"
# #     appsecret = "45f6e89da486a9678b92ae1a9411b846"
    
# #     try:
# #         access_token = get_access_token(appid, appsecret)
# #         articles = get_all_published_articles(access_token)
        
# #         print(f"共获取到 {len(articles)} 篇文章")
# #         if articles:
# #             print("\n最新5篇文章:")
# #             for article in articles[:5]:
# #                 print(f"标题: {article['title']}")
# #                 print(f"URL: {article['url']}")
# #                 print(f"发布时间: {article['create_time']}")
# #                 print("-" * 50)
# #         else:
# #             print("未找到已发布文章，请确认公众号有符合条件的文章")
# #     except Exception as e:
# #         print(f"Error: {e}")


# import requests
# import time
# import json
# import os
# from datetime import datetime, timedelta
# import logging

# # 配置日志
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     filename='wechat_article_fetcher.log'
# )

# # 配置信息（请修改为你的公众号信息）
# WECHAT_APPID = "wxcf66c3b0f23704e7"
# WECHAT_SECRET = "45f6e89da486a9678b92ae1a9411b846"
# OUTPUT_FILE = "wechat_articles.txt"
# TOKEN_CACHE_FILE = "access_token_cache.json"

# def get_access_token():
#     """获取并缓存微信API访问令牌"""
#     try:
#         # 尝试从缓存加载
#         if os.path.exists(TOKEN_CACHE_FILE):
#             with open(TOKEN_CACHE_FILE, 'r') as f:
#                 cache = json.load(f)
#                 if cache['expire_time'] > time.time() + 60:  # 提前60秒刷新
#                     logging.info("从缓存加载access_token")
#                     return cache['access_token']
        
#         # 重新获取令牌
#         logging.info("请求新的access_token")
#         url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={WECHAT_APPID}&secret={WECHAT_SECRET}"
#         response = requests.get(url).json()
        
#         if 'access_token' in response:
#             # 保存到缓存
#             with open(TOKEN_CACHE_FILE, 'w') as f:
#                 json.dump({
#                     'access_token': response['access_token'],
#                     'expire_time': time.time() + response['expires_in']
#                 }, f)
#             return response['access_token']
#         else:
#             logging.error(f"获取access_token失败: {response}")
#             raise Exception(f"获取access_token失败: {response}")
            
#     except Exception as e:
#         logging.error(f"获取access_token时出错: {e}")
#         raise

# def fetch_articles(access_token):
#     """获取公众号已发布文章列表"""
#     try:
#         logging.info("开始获取文章列表")
#         url = f"https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token={access_token}"
#         data = {
#             "offset": 0,
#             "count": 20,  # 最多获取20篇
#             "no_content": 0  # 返回文章内容
#         }
        
#         response = requests.post(url, json=data).json()
        
#         # 调试：打印完整响应结构
#         logging.debug(f"接口原始响应: {response}")
        
#         if 'item' in response:
#             articles = []
#             for item in response['item']:
#                 # 检查必要字段是否存在
#                 if 'content' in item and 'news_item' in item['content']:
#                     # 获取文章创建时间（如果存在）
#                     create_time = item.get('create_time', 0)
#                     formatted_time = datetime.fromtimestamp(create_time).strftime('%Y-%m-%d %H:%M:%S') if create_time else '未知时间'
                    
#                     for news in item['content']['news_item']:
#                         # 确保标题和URL存在
#                         title = news.get('title', '无标题')
#                         url = news.get('url', '无链接')
                        
#                         articles.append({
#                             'title': title,
#                             'url': url,
#                             'create_time': formatted_time
#                         })
#             logging.info(f"成功获取 {len(articles)} 篇文章")
#             return articles
#         else:
#             logging.warning(f"未找到文章: {response}")
#             return []
            
#     except Exception as e:
#         logging.error(f"获取文章时出错: {e}")
#         raise

# def save_articles_to_file(articles):
#     """将文章保存到文件"""
#     try:
#         if not articles:
#             logging.info("没有文章需要保存")
#             return
            
#         with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
#             timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#             f.write(f"# {timestamp} 获取的文章\n")
#             for article in articles:
#                 f.write(f"{article['title']} | {article['url']}\n")
#             f.write("\n")
            
#         logging.info(f"成功保存 {len(articles)} 篇文章到 {OUTPUT_FILE}")
        
#     except Exception as e:
#         logging.error(f"保存文章到文件时出错: {e}")
#         raise

# def get_time_until_noon():
#     """计算距离今天中午12点的秒数"""
#     now = datetime.now()
#     target = now.replace(hour=12, minute=0, second=0, microsecond=0)
    
#     # 如果已经过了今天的12点，计算到明天12点的时间
#     if now > target:
#         target += timedelta(days=1)
        
#     delta = target - now
#     return delta.total_seconds()

# def main_task():
#     """执行主要任务：获取文章并保存"""
#     try:
#         logging.info("开始执行主任务")
#         access_token = get_access_token()
#         articles = fetch_articles(access_token)
#         save_articles_to_file(articles)
#         logging.info("主任务执行完成")
#         return len(articles)
#     except Exception as e:
#         logging.error(f"主任务执行失败: {e}")
#         raise

# def schedule_task():
#     """安排定时任务"""
#     while True:
#         try:
#             seconds_until_noon = get_time_until_noon()
#             logging.info(f"下一次执行时间: {datetime.now() + timedelta(seconds=seconds_until_noon)}")
#             print(f"下一次执行时间: {datetime.now() + timedelta(seconds=seconds_until_noon)}")
            
#             # 等待到中午12点
#             time.sleep(seconds_until_noon)
            
#             # 执行任务
#             count = main_task()
#             print(f"成功获取并保存 {count} 篇文章")
            
#         except KeyboardInterrupt:
#             logging.info("程序被用户中断")
#             print("程序已停止")
#             break
#         except Exception as e:
#             logging.error(f"调度器出错: {e}")
#             print(f"调度器出错: {e}")
#             # 出错后等待10分钟再重试
#             time.sleep(600)

# if __name__ == "__main__":
#     print("微信公众号文章定时获取工具已启动")
#     print(f"日志将保存在: wechat_article_fetcher.log")
#     print(f"文章将保存在: {OUTPUT_FILE}")
#     print("-" * 50)
    
#     try:
#         # 首次运行立即执行一次
#         print("初始化执行一次...")
#         main_task()
#         print("初始化完成")
        
#         # 开始定时任务
#         schedule_task()
#     except Exception as e:
#         print(f"程序启动失败: {e}")
#         logging.critical(f"程序启动失败: {e}")


# import requests
# import json
# import os
# from datetime import datetime
# import logging

# # 配置日志
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     filename='wechat_article_fetcher.log'
# )

# # 配置信息（请修改为你的公众号信息）
# WECHAT_APPID = "wxcf66c3b0f23704e7"
# WECHAT_SECRET = "45f6e89da486a9678b92ae1a9411b846"
# OUTPUT_FILE = "wechat_articles.txt"
# TOKEN_CACHE_FILE = "access_token_cache.json"

# def get_access_token():
#     """获取并缓存微信API访问令牌"""
#     try:
#         # 尝试从缓存加载
#         if os.path.exists(TOKEN_CACHE_FILE):
#             with open(TOKEN_CACHE_FILE, 'r') as f:
#                 cache = json.load(f)
#                 if cache['expire_time'] > time.time() + 60:  # 提前60秒刷新
#                     logging.info("从缓存加载access_token")
#                     return cache['access_token']
        
#         # 重新获取令牌
#         logging.info("请求新的access_token")
#         url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={WECHAT_APPID}&secret={WECHAT_SECRET}"
#         response = requests.get(url).json()
        
#         if 'access_token' in response:
#             # 保存到缓存
#             with open(TOKEN_CACHE_FILE, 'w') as f:
#                 json.dump({
#                     'access_token': response['access_token'],
#                     'expire_time': time.time() + response['expires_in']
#                 }, f)
#             return response['access_token']
#         else:
#             logging.error(f"获取access_token失败: {response}")
#             raise Exception(f"获取access_token失败: {response}")
            
#     except Exception as e:
#         logging.error(f"获取access_token时出错: {e}")
#         raise

# def fetch_articles(access_token):
#     """获取公众号已发布文章列表"""
#     try:
#         logging.info("开始获取文章列表")
#         url = f"https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token={access_token}"
#         data = {
#             "offset": 0,
#             "count": 20,  # 最多获取20篇
#             "no_content": 0  # 返回文章内容
#         }
        
#         response = requests.post(url, json=data).json()
        
#         # 调试：打印完整响应结构
#         logging.debug(f"接口原始响应: {response}")
        
#         if 'item' in response:
#             urls = []
#             for item in response['item']:
#                 # 检查必要字段是否存在
#                 if 'content' in item and 'news_item' in item['content']:
#                     for news in item['content']['news_item']:
#                         # 确保URL存在
#                         url = news.get('url')
#                         if url:
#                             urls.append(url)
#             logging.info(f"成功获取 {len(urls)} 个文章链接")
#             return urls
#         else:
#             logging.warning(f"未找到文章: {response}")
#             return []
            
#     except Exception as e:
#         logging.error(f"获取文章时出错: {e}")
#         raise

# def save_urls_to_file(urls):
#     """将URL保存到文件，每行一个URL"""
#     try:
#         if not urls:
#             logging.info("没有URL需要保存")
#             return
            
#         with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
#             for url in urls:
#                 f.write(f"{url}\n")
            
#         logging.info(f"成功保存 {len(urls)} 个URL到 {OUTPUT_FILE}")
        
#     except Exception as e:
#         logging.error(f"保存URL到文件时出错: {e}")
#         raise

# def main():
#     """主函数：获取文章URL并保存"""
#     try:
#         print("微信公众号文章链接提取工具启动")
#         print(f"日志将保存在: wechat_article_fetcher.log")
#         print(f"URL将保存在: {OUTPUT_FILE}")
#         print("-" * 50)
        
#         logging.info("开始执行主任务")
#         access_token = get_access_token()
#         urls = fetch_articles(access_token)
#         save_urls_to_file(urls)
        
#         print(f"成功获取并保存 {len(urls)} 个文章链接")
#         logging.info("主任务执行完成")
        
#     except Exception as e:
#         print(f"程序执行失败: {e}")
#         logging.critical(f"程序执行失败: {e}")

# if __name__ == "__main__":
#     main()






# import requests
# import json
# import os
# from datetime import datetime
# import logging
# import time  # 添加time模块导入

# # 配置日志
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     filename='wechat_article_fetcher.log'
# )

# # 配置信息（请修改为你的公众号信息）
# WECHAT_APPID = "wxcf66c3b0f23704e7"
# WECHAT_SECRET = "45f6e89da486a9678b92ae1a9411b846"
# OUTPUT_FILE = "wechat_articles.txt"
# TOKEN_CACHE_FILE = "access_token_cache.json"

# def get_access_token():
#     """获取并缓存微信API访问令牌"""
#     try:
#         # 尝试从缓存加载
#         if os.path.exists(TOKEN_CACHE_FILE):
#             with open(TOKEN_CACHE_FILE, 'r') as f:
#                 cache = json.load(f)
#                 if cache['expire_time'] > time.time() + 60:  # 提前60秒刷新
#                     logging.info("从缓存加载access_token")
#                     return cache['access_token']
        
#         # 重新获取令牌
#         logging.info("请求新的access_token")
#         url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={WECHAT_APPID}&secret={WECHAT_SECRET}"
#         response = requests.get(url).json()
        
#         if 'access_token' in response:
#             # 保存到缓存
#             with open(TOKEN_CACHE_FILE, 'w') as f:
#                 json.dump({
#                     'access_token': response['access_token'],
#                     'expire_time': time.time() + response['expires_in']
#                 }, f)
#             return response['access_token']
#         else:
#             logging.error(f"获取access_token失败: {response}")
#             raise Exception(f"获取access_token失败: {response}")
            
#     except Exception as e:
#         logging.error(f"获取access_token时出错: {e}")
#         raise

# def fetch_articles(access_token):
#     """获取公众号已发布文章列表"""
#     try:
#         logging.info("开始获取文章列表")
#         url = f"https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token={access_token}"
#         data = {
#             "offset": 0,
#             "count": 20,  # 最多获取20篇
#             "no_content": 0  # 返回文章内容
#         }
        
#         response = requests.post(url, json=data).json()
        
#         # 调试：打印完整响应结构
#         logging.debug(f"接口原始响应: {response}")
        
#         if 'item' in response:
#             urls = []
#             for item in response['item']:
#                 # 检查必要字段是否存在
#                 if 'content' in item and 'news_item' in item['content']:
#                     for news in item['content']['news_item']:
#                         # 确保URL存在
#                         url = news.get('url')
#                         if url:
#                             urls.append(url)
#             logging.info(f"成功获取 {len(urls)} 个文章链接")
#             return urls
#         else:
#             logging.warning(f"未找到文章: {response}")
#             return []
            
#     except Exception as e:
#         logging.error(f"获取文章时出错: {e}")
#         raise

# def save_urls_to_file(urls):
#     """将URL保存到文件，每行一个URL"""
#     try:
#         if not urls:
#             logging.info("没有URL需要保存")
#             return
            
#         with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
#             for url in urls:
#                 f.write(f"{url}\n")
            
#         logging.info(f"成功保存 {len(urls)} 个URL到 {OUTPUT_FILE}")
        
#     except Exception as e:
#         logging.error(f"保存URL到文件时出错: {e}")
#         raise

# def main():
#     """主函数：获取文章URL并保存"""
#     try:
#         print("微信公众号文章链接提取工具启动")
#         print(f"日志将保存在: wechat_article_fetcher.log")
#         print(f"URL将保存在: {OUTPUT_FILE}")
#         print("-" * 50)
        
#         logging.info("开始执行主任务")
#         access_token = get_access_token()
#         urls = fetch_articles(access_token)
#         save_urls_to_file(urls)
        
#         print(f"成功获取并保存 {len(urls)} 个文章链接")
#         logging.info("主任务执行完成")
        
#     except Exception as e:
#         print(f"程序执行失败: {e}")
#         logging.critical(f"程序执行失败: {e}")

# if __name__ == "__main__":
#     main()







import requests
import json
import os
from datetime import datetime
import logging
import time

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='wechat_article_fetcher.log'
)

# 配置信息（请修改为你的公众号信息）
WECHAT_APPID = "wxcf66c3b0f23704e7"
WECHAT_SECRET = "45f6e89da486a9678b92ae1a9411b846" #替换成自己的Appid和AppSecret，同时别忘了把自己ip设置成白名单‼️
OUTPUT_FILE = "wechat_articles.txt"
TOKEN_CACHE_FILE = "access_token_cache.json"

def get_access_token():
    """获取并缓存微信API访问令牌"""
    try:
        # 尝试从缓存加载
        if os.path.exists(TOKEN_CACHE_FILE):
            with open(TOKEN_CACHE_FILE, 'r') as f:
                cache = json.load(f)
                if cache['expire_time'] > time.time() + 60:  # 提前60秒刷新
                    logging.info("从缓存加载access_token")
                    return cache['access_token']

        # 重新获取令牌
        logging.info("请求新的access_token")
        url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={WECHAT_APPID}&secret={WECHAT_SECRET}"
        response = requests.get(url).json()

        if 'access_token' in response:
            # 保存到缓存
            with open(TOKEN_CACHE_FILE, 'w') as f:
                json.dump({
                    'access_token': response['access_token'],
                    'expire_time': time.time() + response['expires_in']
                }, f)
            return response['access_token']
        else:
            logging.error(f"获取access_token失败: {response}")
            raise Exception(f"获取access_token失败: {response}")

    except Exception as e:
        logging.error(f"获取access_token时出错: {e}")
        raise

def fetch_articles(access_token):
    """获取公众号已发布文章列表"""
    try:
        logging.info("开始获取文章列表")
        url = f"https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token={access_token}"
        data = {
            "offset": 0,
            "count": 20,  # 最多获取20篇
            "no_content": 0  # 返回文章内容
        }

        response = requests.post(url, json=data).json()

        # 调试：打印完整响应结构
        logging.debug(f"接口原始响应: {response}")

        if 'item' in response:
            articles = []
            for item in response['item']:
                # 检查必要字段是否存在
                if 'content' in item and 'news_item' in item['content']:
                    for news in item['content']['news_item']:
                        # 确保标题、图片链接和URL存在
                        title = news.get('title', '无标题')
                        image = news.get('thumb_url', '')
                        url = news.get('url', '无链接')
                        articles.append({
                            'title': title,
                            'image': image,
                            'url': url
                        })
            logging.info(f"成功获取 {len(articles)} 篇文章")
            return articles
        else:
            logging.warning(f"未找到文章: {response}")
            return []

    except Exception as e:
        logging.error(f"获取文章时出错: {e}")
        raise

def save_articles_to_file(articles):
    """将文章信息保存到文件，每行格式为 标题|图片链接|文章链接"""
    try:
        if not articles:
            logging.info("没有文章需要保存")
            return

        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            for article in articles:
                f.write(f"{article['title']}|{article['image']}|{article['url']}\n")

        logging.info(f"成功保存 {len(articles)} 篇文章到 {OUTPUT_FILE}")

    except Exception as e:
        logging.error(f"保存文章到文件时出错: {e}")
        raise

def main():
    """主函数：获取文章信息并保存"""
    try:
        print("微信公众号文章信息提取工具启动")
        print(f"日志将保存在: wechat_article_fetcher.log")
        print(f"文章信息将保存在: {OUTPUT_FILE}")
        print("-" * 50)

        logging.info("开始执行主任务")
        access_token = get_access_token()
        articles = fetch_articles(access_token)
        save_articles_to_file(articles)

        print(f"成功获取并保存 {len(articles)} 篇文章信息")
        logging.info("主任务执行完成")

    except Exception as e:
        print(f"程序执行失败: {e}")
        logging.critical(f"程序执行失败: {e}")

if __name__ == "__main__":
    main()

