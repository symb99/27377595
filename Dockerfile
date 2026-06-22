FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y apache2 nano net-tools python3 python3-pip libapache2-mod-wsgi-py3 python3-venv && \
    rm -rf /var/lib/apt/lists/*

RUN a2enmod wsgi

COPY . /var/www/html/ATI/

RUN chmod -R 755 /var/www/html/ATI && \
    chmod +x /var/www/html/ATI/index.py

RUN chown -R www-data:www-data /var/www/html/ATI

RUN echo "WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py" > /etc/apache2/conf-available/mod-wsgi.conf && \
    a2enconf mod-wsgi

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]