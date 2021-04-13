## Vycord

Vycord is a discord bot with a managed user permissions system so that commands can be written easier in single javascript classes. The goal is to make plugin creation for commands for discord easier to write and less worry about managing who can use the commands

Assign a command to a group and it will keep the bot from executing that command
![enter image description here](https://lh3.googleusercontent.com/uYXNWaDAayg1cPlKw1QLb1OylYXSO2ClOS7y48uasJkE1QRoGw-CcX1YpcvufBtY-wF8Cr42bNEKjTOwsv-zpuAAFDRgJab4tnZhwR2KXVwPdPX3znwUda5S8FvHvwvo6f7I77QXMWhQ-YuAxp_VcDPRN2iK6ilAON8Ubuu8WrQ7YHspMaLqKU-WmdJzvPg_Oafnrh9B29SwbkANe_cnNHp9dlvXiirnb_NqAjHMHYM0KZDgAXS9vquQiW-8YvRk_Z4qXK0x6kHgiJsYWyVZlXD_cxNBQDMy4T77gOScRuoLutUz8uGicCUU1B6oZdIzMycjnnbUI_xCTMIkWpr8960rzLNjJ1sDURBqUG0zpSWP59xIm0lsSh0PDbXmJcnrFYozzQV-BtiLtbKWg7jH2u9Ej9DVZeysJTVzuniU9vAObRKOD3_-162-Kqevx2vOIiAgBVok7AJhNarm8ii6vDOf0hBGaU6LfHe984ioEy2MArr-_bkkJxQTzmEDrRtT80f8nmcI8uSeT76BB5Gbfms8yqcWuGfWNtZ6CmCJJVO_9z3CcTjMRGbi0jkLap3cqflYxZA4FSgVm9AM-x0Ds_NTTix1mio0E1POVAZZtPzQ30Ab1v4p59lLUJX4ILvcsIRMXHIdCMUCPxriJjdH5lkx-j-5iTyr-2xwZK9amwgSNeKkp8hBYfdgfAhadoklZTcL9KMjTJyB-kurdHfe9g=w519-h471-no?authuser=0)


## Easy to write commands 

The commands can be written in an ES6 class with the message object given by the [Discord.js API](https://discord.js.org/#/docs/main/stable/class/Message). The command class that is used to extend your code has features like collections and stringify arguments passed after a command.
This allows for complex interactions with less code! Check out the [Pixibay API command](https://github.com/JacobGonzalez0/Vycord/blob/main/commands/pixibay.js) for an example.

![enter image description here](https://lh3.googleusercontent.com/RlU8Kt8paTDiTGkDcdIMFGeGLBZFW6i0y-MUWjiVgDDzDP0YfKZMLdJ4c1jnM_pNd8-zpslYFO4eNtyusNhh3RhWf4zdQirZ1ZhG1CVCBo4Mg9vWsvkCOqCAnBtuUQMpceDICHpyNtygwcO3fjT4RyT9mpfvuqz9Znhos_MM8yA8fgR5q8wD_105Ch7pcdXAxw89-3z9v_Y73L-E2Q5GZ4cW33Z_LEAiWFGpllVL1eqzG4jPmDjyDR3gPiFrM7vfa3WoJ-FbBCXXENxhonRFK7XAbFhorCpntniv03InFcKLcnPwPgKiIXAEkS4i_3C9QckTuBnpgbbBzMTpbrOTnFecw_NpJrbbahmxe0f1MEG2Ylk3ttsmcBGDEJfc6llHNIcHP4HmO5fFGWyz6-U_ELU8K7oIx_Gn-oo7iOUFolSYDKKb9EyhRvW4Ovrp2T8C8fZSgVED7tJ9R31N8nOCpjG-z62wMS30B1M7T8Y5Wvf_SPZ6peL7G4mPPZQMoehK8ygWIurX0YSXI4UD-v_E3iV3K7zZT3G0gKlpaHVx5utuHoIeJor3dqFVfeEtUGYwIbokAKYJmCIAh9o9yeQR_-rlcAp3LhOmbLdQAPqCzOYwvCIFpnwLUeEkYKrkhnTdbCfXyaWWq_QpNdFJODf80PpXiSSQgG7fF4EOdW_bA7QmejxIQhvNGFWwNAur8iYZ1ADDajn-V9tkoMmSJ9WXuw=w519-h471-no?authuser=0)
The pixibay command can manage mulitple instances of itself on a chat so users can search though multiple queries without having to make commands to activate an older instance.

These user features are more friendly and useful when you have chats that are very active and you don't want to clog up the feed!
