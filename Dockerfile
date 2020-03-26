FROM python:3.7-stretch

WORKDIR /usr/src/app/

RUN apt-get -y update && apt-get install -y curl vim
COPY ./requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
COPY . /usr/src/app/



EXPOSE 8000

CMD ["python", "/usr/src/app/app.py"]

