require 'rdiscount'
require 'erb'

desc "build docs"
task :docs do
	version = File.open('VERSION.txt', "r").read
  mdown = RDiscount.new(ERB.new(File.open('doc/doc.md','r').read).result(binding), :smart).to_html
  roadgeek = File.open("doc/roadgeek.css", "r").read
  wrapper = File.open('doc/doc_wrapper.erb','r').read
  mdown   = File.open('index.html','w+') do |f|
    html = ERB.new(wrapper).result(binding)
    f.write html.gsub(/\{\{/,"<%").gsub(/\}\}/,"%>")
  end  
end